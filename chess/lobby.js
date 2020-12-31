const Chess = require("./chess")

const Lobby = function(name, playingNpc) {
  this.game = new Chess(playingNpc);
  this.name = name;
  this.players = [];
  this.logs = [];
}

//////////////////////////////////////////////////////////////////
// Chat Functions
/////////////////////////////////////////////////////////////////

Lobby.prototype.addMessage = function(io, { name, role, msg }) {
  this.logs.push({ name, msg, role });
  this.sendLogs(io);
}

Lobby.prototype.sendLogs = function(io) {
  io.in(this.name).emit('Chat Update', this.logs);
}

//////////////////////////////////////////////////////////////////
// Chess Functions
/////////////////////////////////////////////////////////////////

Lobby.prototype.init = function() {
  this.game.init();
}

Lobby.prototype.isGameOver = function() {
  return this.game.gameOver;
}

Lobby.prototype.playAgain = function() {
  this.game = new Chess();
}

Lobby.prototype.updateGame = function(socket, io, role, clickX, clickY, promoteSelection) {
  // if(role === this.game.color && !this.isGameOver()) {
    if (this.game.selectedPiece) {
      this.game.handleClick(clickX, clickY, this, socket, io, promoteSelection);
      io.in(this.name).emit('update', this.game.pieces, this.game.color, this.game.getKingStates());
    } else {
      this.game.select(clickX, clickY);
      socket.emit('update', this.game.pieces, this.game.color, this.game.getKingStates());
    }
  // }
}

Lobby.prototype.BlackAndWhitePresent = function() {
  let containsWhite = false;
  let containsBlack = false;
  for (let player of this.players) {
    if (player.role === 'White')
      containsWhite = true;

    if (player.role === 'Black')
      containsBlack = true;

    if (containsWhite && containsBlack)
    return { status: true, playerMissing: '' };
  }
  
  if (containsWhite)
    return { status: false, playerMissing: 'Black' };
  else
    return { status: false, playerMissing: 'White' };
}

//////////////////////////////////////////////////////////////////
// Lobby Functions
/////////////////////////////////////////////////////////////////

Lobby.prototype.addPlayer = function(player) {
  const { username, role } = player;
  const responses = [];
  
  for (let user of this.players) {
    if (user.username === username)
      responses.push({ msg: "Cannot Join, Username Already Taken", type: "danger" });
    
    if (user.role === role && role !== "Spectator")
      responses.push({ msg: "Cannot Join, Color Already Taken", type: "danger" });
  }

  if (responses.length === 0) {
    this.players.push({ username, role });
    responses.push({ msg: "Success! Joining Room...", type: "success" });
    return { status: "Success", responses };
  }

  return { status: "Failed", responses };
}

Lobby.prototype.removePlayer = function(username){
  let indexOfPlayerToRemove = this.players.findIndex(item => item.username === username);
  if (indexOfPlayerToRemove !== -1)
    this.players.splice(indexOfPlayerToRemove, 1);
}

module.exports = Lobby;