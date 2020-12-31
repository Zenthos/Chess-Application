const Lobby = require('../chess/lobby');

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

      socket.on('join room', (username, roomName, role, callback) => {
        const client = { username, roomName, role };
        this.clients[socket.client.id] = client;

        if (!this.lobbies.hasOwnProperty(roomName)) {
          this.lobbies[roomName] = new Lobby(roomName);
          this.lobbies[roomName].init();
        } 
        
        let lobby = this.getLobby(roomName);
        socket.join(roomName);
        lobby.addMessage(this.io, { name: 'System', msg: `${username} (${role}) has joined!`, role: 'Admin'});
        
        // This callback is used to send the client a message if connection was successful or rejected
        callback(lobby.addPlayer(client));

        this.io.emit('Update Lobbies', this.getAllLobbies());
      });
      
      socket.on('disconnect', () => {
        if (!this.clients.hasOwnProperty(socket.client.id)) return;
        
        const { username, roomName, role } = this.getClient(socket.client.id);
        const lobby = this.getLobby(roomName);
        
        lobby.addMessage(this.io, { name: 'System', msg: `${username} (${role}) has disconnected!`, role: 'Admin'})
        lobby.removePlayer(username);
        
        if (lobby.players.length === 0) {
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

      socket.on("Update Game", (clickX, clickY, promoteSelection) => {
        if (!this.clients.hasOwnProperty(socket.client.id)) return;
        
        const { roomName, role } = this.getClient(socket.client.id);
        const lobby = this.lobbies[roomName];
        
        lobby.updateGame(socket, this.io, role, clickX, clickY, promoteSelection);
      });
      
      socket.on('Send Message', (name, msg, role) => {
        if (!this.clients.hasOwnProperty(socket.client.id)) return;
        
        const roomName =  this.getRoomName(socket.client.id);
        const lobby = this.getLobby(roomName);
        
        lobby.addMessage(this.io, { name, msg, role });
      });
      
      //////////////////////////////////////////////////////////////////
      // Functions that send Client Data
      /////////////////////////////////////////////////////////////////
      
      socket.on('Get Game', () => {
        if (!this.clients.hasOwnProperty(socket.client.id)) return;
        
        const roomName =  this.getRoomName(socket.client.id);
        const { game } = this.lobbies[roomName];
        
        socket.emit('update', game.pieces, game.color, game.getKingStates());
        
        const { status, playerMissing } = this.lobbies[roomName].BlackAndWhitePresent();
        this.io.in(roomName).emit('wait', status, playerMissing);
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
      
      socket.on('Get Moves', () => {
        if (!this.clients.hasOwnProperty(socket.client.id)) return;
        
        const roomName =  this.getRoomName(socket.client.id);
        const { game } = this.getLobby(roomName);
        
        console.log(game.moveHistory);
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
