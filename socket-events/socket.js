const Lobby = require('../chess/lobby');

module.exports = class WebSocket {
  constructor(io) {
    this.io = io;
    this.clients = {};
    this.lobbies = {};
  }

  getCondensedLobbies = () => {
    let condensedLobbies = [];
    for (let property in this.lobbies) {
      let lobby = this.lobbies[property];
      let newLobby = { name: lobby.name, white: 0, black: 0, spectators: 0 };
      for (let player of lobby.players) {
        if (player.role === 'White')
          newLobby.white = 1;
        if (player.role === 'Black')
          newLobby.black = 1;
        if (player.role === 'Spectator')
          newLobby.spectators += 1;
      }
      condensedLobbies.push(newLobby);
    }
    return condensedLobbies;
  }

  start = () => {
    this.io.on("connection", (socket) => {
      socket.on('join room', (username, roomName, role, callback) => {
        const client = { username, roomName, role };
        this.clients[socket.client.id] = client;

        if (!this.lobbies.hasOwnProperty(roomName)) {
          this.lobbies[roomName] = new Lobby(roomName);
          this.lobbies[roomName].init();
        }

        socket.join(roomName);
        
        this.lobbies[roomName].logs.push({ name: 'System', msg: `${username} (${role}) has joined!`, role: 'Admin'});
        this.io.in(roomName).emit('Chat Update', this.lobbies[roomName].logs);

        callback(this.lobbies[roomName].addPlayer(client));
        this.io.emit('Update Lobbies', this.getCondensedLobbies());
      });

      socket.on("click", (clickX, clickY, promoteSelection) => {
        if (!this.clients.hasOwnProperty(socket.client.id)) return;
        
        const { roomName, role } = this.clients[socket.client.id];
        const { game } = this.lobbies[roomName];

        if(role === game.color && !this.lobbies[roomName].isGameOver()) {
          if (game.selectedPiece) {
            game.handleClick(clickX, clickY, this.lobbies[roomName], socket, this.io, promoteSelection);
            this.io.in(roomName).emit('update', game.pieces, game.color, game.getKingStates());
          } else {
            game.select(clickX, clickY);
            socket.emit('update', game.pieces, game.color, game.getKingStates());
          }
        }

      });
    
      socket.on('Send Message', (name, msg, role) => {
        if (!this.clients.hasOwnProperty(socket.client.id)) return;

        const { roomName } = this.clients[socket.client.id];
        const { logs } = this.lobbies[roomName];
        logs.push({ name, msg, role });
        this.io.in(roomName).emit('Chat Update', logs);
      });

      socket.on('test', () => {
        if (!this.clients.hasOwnProperty(socket.client.id)) return;

        const { roomName } = this.clients[socket.client.id];
        const { game } = this.lobbies[roomName];

        console.log(game.moveHistory);
      });
    
      socket.on('Get Logs', () => {
        if (!this.clients.hasOwnProperty(socket.client.id)) return;

        const { roomName } = this.clients[socket.client.id];
        const { logs } = this.lobbies[roomName];
        
        this.io.in(roomName).emit('Chat Update', logs);
      })

      socket.on('Get Lobbies', () => {
        socket.emit('Update Lobbies', this.getCondensedLobbies());
      })
    
      socket.on('request update', () => {
        if (!this.clients.hasOwnProperty(socket.client.id)) return;

        const { roomName } = this.clients[socket.client.id];
        const { game } = this.lobbies[roomName];

        socket.emit('update', game.pieces, game.color, game.getKingStates());

        const { status, playerMissing } = this.lobbies[roomName].BlackAndWhitePresent();
        this.io.in(roomName).emit('wait', status, playerMissing);
      });

      socket.on('disconnect', () => {
        if (!this.clients.hasOwnProperty(socket.client.id)) return;

        const { username, roomName, role } = this.clients[socket.client.id];
        const { logs, players } = this.lobbies[roomName];

        this.lobbies[roomName].logs.push({ name: 'System', msg: `${username} (${role}) has disconnected!`, role: 'Admin'})
        this.io.in(roomName).emit('Chat Update', logs);

        let playerToRemove = players.findIndex(item => item.username === username);
        if (playerToRemove !== -1)
          players.splice(playerToRemove, 1);

        if (players.length === 0)
          delete this.lobbies[roomName];
        else {
          const { status, playerMissing } = this.lobbies[roomName].BlackAndWhitePresent();
          this.io.in(roomName).emit('wait', status, playerMissing);
        }

        socket.leave(roomName);
        this.io.emit('Update Lobbies', this.getCondensedLobbies());
        delete this.clients[socket.client.id];
      });
    });
  }
}