const Lobby = require('./lobby');

module.exports = class SocketListeners {
  constructor(io) {
    this.io = io;
    this.clients = {};
    this.lobbies = {};
  }
  
  start = () => {
    this.io.on("connection", (socket) => {

      //////////////////////////////////////////////////////////////////
      // Joining And Leaving
      /////////////////////////////////////////////////////////////////

      socket.on('join room', (username, roomName, role, playingNPC, callback) => {
        const client = { username, roomName, role };
        this.clients[socket.client.id] = client;

        if (!this.lobbies.hasOwnProperty(roomName)) {
          this.lobbies[roomName] = new Lobby(roomName, playingNPC);
          this.lobbies[roomName].init();
        } 
        
        let lobby = this.getLobby(roomName);
        socket.join(roomName);
        lobby.addMessage(this.io, 'System', 'Admin', `${username} (${role}) has joined!`);

        // This callback is used to send the client a message if connection was successful or rejected
        callback(lobby.addPlayer(client));

        this.io.emit('Update Lobbies', this.getAllLobbies());
      });
      
      socket.on('disconnect', () => {
        if (!this.clients.hasOwnProperty(socket.client.id)) return;
        
        const { username, roomName, role } = this.getClient(socket.client.id);
        const lobby = this.getLobby(roomName);
        
        lobby.addMessage(this.io, 'System', 'Admin', `${username} (${role}) has disconnected!`)
        lobby.removePlayer(username);
        
        if (lobby.players.length === 0 || lobby.onlyContainsAI()) {
          delete this.lobbies[roomName];
        } else {
          const { status, playerMissing } = lobby.BlackAndWhitePresent();
          this.io.in(roomName).emit('wait', status, playerMissing);
        }
        
        socket.leave(roomName);
        this.io.emit('Update Lobbies', this.getAllLobbies());
        delete this.clients[socket.client.id];
      });

      //////////////////////////////////////////////////////////////////
      // Functions that Update Server Data
      /////////////////////////////////////////////////////////////////

      socket.on("Update Game", (move) => {
        if (!this.clients.hasOwnProperty(socket.client.id)) return;
        
        const { roomName, role } = this.getClient(socket.client.id);
        const lobby = this.lobbies[roomName];
        
        lobby.updateGame(this.io, role, move);
      });
      
      socket.on('Send Message', (msg) => {
        if (!this.clients.hasOwnProperty(socket.client.id)) return;
        
        const { username, role } = this.getClient(socket.client.id);
        const roomName =  this.getRoomName(socket.client.id);
        const lobby = this.getLobby(roomName);
        
        lobby.addMessage(this.io, username, role, msg);
      });
      
      //////////////////////////////////////////////////////////////////
      // Functions that send Client Data
      /////////////////////////////////////////////////////////////////
      
      socket.on('Get Game', () => {
        if (!this.clients.hasOwnProperty(socket.client.id)) return;
        
        const roomName =  this.getRoomName(socket.client.id);
        const { role } = this.getClient(socket.client.id);
        const lobby = this.lobbies[roomName];
        lobby.game.init();
        
        socket.emit('set client color', role);
        
        const { status, playerMissing } = lobby.BlackAndWhitePresent();
        this.io.in(roomName).emit('wait', status, playerMissing);
        socket.emit('update', lobby.game.getBoard(role), lobby.game.getGameState(), lobby.game.currentPlayer);

        if (role === 'Black')
          lobby.updateGame(this.io, role, null);
      });
      
      socket.on('Get Logs', () => {
        if (!this.clients.hasOwnProperty(socket.client.id)) return;
        
        const roomName =  this.getRoomName(socket.client.id);
        const lobby = this.getLobby(roomName);
        
        lobby.sendLogs(this.io);
      });
      
      socket.on('Get Lobbies', () => {
        socket.emit('Update Lobbies', this.getAllLobbies());
      });
    });
  }
  
  //////////////////////////////////////////////////////////////////
  // Helper Functions
  /////////////////////////////////////////////////////////////////

  getAllLobbies = () => {
    let lobbies = [];
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
      lobbies.push(newLobby);
    }
    return lobbies;
  }
  
  getClient = (id) => {
    if (this.clients.hasOwnProperty(id))
      return this.clients[id];
  }
  
  getRoomName = (id) => {
    return this.getClient(id).roomName;
  }
  
  getLobby = (roomName) =>{
    if (this.lobbies.hasOwnProperty(roomName)) 
      return this.lobbies[roomName];
  }
}
