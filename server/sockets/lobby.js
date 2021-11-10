const ChessEngine = require('../chess/engine');

const Lobby = function(name, playingNPC) {
  this.game = new ChessEngine();
  this.name = name;
  this.players = [];
  this.logs = [];
  this.opponentIsNPC = playingNPC;
}

//////////////////////////////////////////////////////////////////
// Chat Functions
/////////////////////////////////////////////////////////////////

Lobby.prototype.addMessage = function(io, name, role, msg) {
  let log = { id: this.logs.length, name, msg, role };

  if (msg === '!history') console.log(this.game.history);

  this.logs.push(log);
  if (this.logs.length > 30) this.logs.shift();

  this.sendLogs(io);
}

Lobby.prototype.sendLogs = function(io) {
  io.in(this.name).emit('Chat Update', this.logs);
}

//////////////////////////////////////////////////////////////////
// Chess Functions
/////////////////////////////////////////////////////////////////

Lobby.prototype.init = function(role, difficulty) {
  this.game.init();
  if (this.opponentIsNPC) {
    this.npcStrength = difficulty;
    this.game.computerColor = (role === 'White' ? 'Black' : 'White');
  }
}

Lobby.prototype.updateGame = function(io, socket, role, move) {
  if (role === this.game.currentPlayer && !this.game.gameOver) {
    this.game.makeMove(socket, role, move);
    this.game.switchPlayer();
    io.in(this.name).emit('update', this.game.getBoard(role), this.game.getGameState(), this.game.lastMove);
    io.in(this.name).emit('Update Moves', this.game.history);
  }

  setTimeout(() => {
    if (this.opponentIsNPC && !this.game.gameOver) {
      let AIMove = this.chooseAIMove(this.game.currentPlayer);
      this.game.makeMove(socket, this.game.currentPlayer, AIMove);
      this.game.switchPlayer();
      io.in(this.name).emit('update', this.game.getBoard(role), this.game.getGameState(), this.game.lastMove);
      io.in(this.name).emit('Update Moves', this.game.history);
    }
  }, 1000);

  if (this.game.gameOver) {
    io.in(this.name).emit('game over', this.game.getGameState());
  }
}

Lobby.prototype.updatePiece = function(io, role, newPiece) {
  this.game.updatePiece(role, newPiece);
  io.in(this.name).emit('update', this.game.getBoard(role), this.game.getGameState(), this.game.lastMove);
}

//////////////////////////////////////////////////////////////////
// AI Functions
/////////////////////////////////////////////////////////////////

Lobby.prototype.chooseAIMove = function(side) {
  let move;
  do {
    // move = this.game.randomMove(side);

    let d = new Date().getTime();
    move = this.game.chooseBestMove(side, this.npcStrength);
    let d2 = new Date().getTime();
    let moveTime = (d2 - d);
    // console.log(moveTime);
  } while (!move && !this.game.gameOver);
  
  return move;
}

//////////////////////////////////////////////////////////////////
// Lobby Functions
/////////////////////////////////////////////////////////////////

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
    
    if (this.opponentIsNPC && !this.players.some((player) => player.username === 'AIOpponent'))
      this.players.push({ username: 'AIOpponent', role: `${this.players[0].role === 'White'? 'Black':'White'}`, difficulty: "easy" });
    
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

Lobby.prototype.onlyContainsAI = function() {
  if (this.players.length === 1) {
    let lastPlayer = this.players[0];

    if (lastPlayer.username === 'AIOpponent' && lastPlayer.hasOwnProperty('difficulty'))
      return true;
  }
  return false;
}

module.exports = Lobby;