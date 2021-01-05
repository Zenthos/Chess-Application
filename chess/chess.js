const { Rook, Knight, Bishop, Queen, King, Pawn } = require('./pieces');

const Chess = function() {
  this.pieces = [];
  this.toDelete = [];
  this.color = 'White';
  this.selectedPiece = null;
  this.gameOver = false;
  this.moveHistory = [];
  this.piecesToDelete = [];
  this.promoting = false;
}

//////////////////////////////////////////////////////////////////
// Init Functions
/////////////////////////////////////////////////////////////////

Chess.prototype.init = function() {
  for (let color of ['White', 'Black']) {
    let y = ( color === 'White' ? 7 : 0 );
    for (let x = 0; x <= 7; x++) {
      switch(x) {
        case 7:
        case 0: this.pieces.push(new Rook('Rook', color, x, y, 'R')); 
                break;
        case 6:
        case 1: this.pieces.push(new Knight('Knight', color, x, y, 'N')); 
                break;
        case 5:
        case 2: this.pieces.push(new Bishop('Bishop', color, x, y, 'B')); 
                break;
        case 3: this.pieces.push(new Queen('Queen', color, x, y, 'Q'));
                break;
        case 4: this.pieces.push(new King('King', color, x, y, 'K')); 
                break;
      }
    }

    y = ( color === 'White' ? 6 : 1 );
    for (let x = 0; x <= 7; x++) 
      this.pieces.push(new Pawn('Pawn', color, x, y, ''));
  }
}

//////////////////////////////////////////////////////////////////
// Chess Functions
/////////////////////////////////////////////////////////////////

Chess.prototype.handleClick = function(clickX, clickY, lobby, socket, io, selection) {
  let newSpot = { x: clickX, y: clickY };
  let selected = this.selectedPiece;
  
  if (((selected.x !== newSpot.x || selected.y !== newSpot.y) && selected.legalMove(this.pieces, newSpot)) || this.promoting) {
    selected.moveOrCapture(this.pieces, newSpot, lobby);
    selected.availableTiles.splice(0, selected.availableTiles.length);

    if (this.promoting) {
      this.promotion(selected, selection);
    } else {
      if ([0, 7].includes(newSpot.y) && selected.pieceType === 'Pawn') {
        socket.emit('set need to promote');
        this.promoting = true;
      }
      this.generateMoveSyntax(lobby, io);
      this.switchColor();
    }
    this.isGameEnding(lobby, io);
  }

  if (!this.promoting) {
    this.selectedPiece.selected = false;
    this.selectedPiece = null;
  }
  this.deleteObsoletePieces();
}

Chess.prototype.isGameEnding = function(lobby, io) {
  let count = 0;
  let allyPieces = this.pieces.filter((piece) => piece.player === this.color);

  for (let piece of allyPieces) {
    if (piece.listOfMoves(this.pieces).length > 0) {
      // console.log(piece.pieceType, piece.player, piece.x, piece.y);
      count += piece.listOfMoves(this.pieces).length;
    }
  }

  if (count === 0) {
    if (this.kingIsInCheck())
      this.endGame(lobby, io, `${this.color} has been Checkmated! ${this.color === 'White' ? 'Black' : 'White'} has won!`);
    else
      this.endGame(lobby, io, `${this.color} has no more legal moves! The King is not in check however, so the game ends in a Stalemate!`);
  } else {
    if (this.kingIsInCheck()) {
      lobby.logs.push({ 
        name: 'System', 
        msg: `${this.color} King is in Check!`, 
        role: 'Admin'
      });

      this.moveHistory[this.moveHistory.length - 1] += '+';
      io.in(lobby.name).emit('Chat Update', lobby.logs); 
    }
  }
}

Chess.prototype.promotion = function(selected, option) {
  for (let [index, piece] of this.pieces.entries()) {
    if (piece.pieceType === 'Pawn' &&  piece.player === this.color && piece.x === selected.x && piece.y === selected.y) {
      switch(option) {
        case 'Rook':
          this.pieces[index] = new Rook('Rook', selected.player, selected.x, selected.y, 'R');
          break;
        case 'Knight':
          this.pieces[index] = new Knight('Knight', selected.player, selected.x, selected.y, 'N');
          break;
        case 'Bishop':
          this.pieces[index] = new Bishop('Bishop', selected.player, selected.x, selected.y, 'B');
          break;
        case 'Queen':
          this.pieces[index] = new Queen('Queen', selected.player, selected.x, selected.y, 'Q');
          break;
      }
    }
  }

  let promotionLetter = { 'Rook' : 'R', 'Knight': 'N', 'Bishop': 'B', 'Queen': 'Q' };
  this.promoting = false;
  this.moveHistory[this.moveHistory.length - 1] += `=${promotionLetter[option]}`
}

Chess.prototype.select = function(clickX, clickY) {
  for (let piece of this.pieces) {
    if (piece.x === clickX && piece.y === clickY && piece.player === this.color) {
      this.selectedPiece = piece;
      piece.selected = true;
      piece.availableTiles = piece.listOfMoves(this.pieces);
      break;
    }
  }
}

//////////////////////////////////////////////////////////////////
// AI Functions
/////////////////////////////////////////////////////////////////

Chess.prototype.getRandomPiece = function() {
  let allyPieces = this.pieces.filter((piece) => piece.player === this.color && piece.listOfMoves(this.pieces).length > 0);

  return allyPieces[Math.floor(Math.random() * allyPieces.length)];
}

Chess.prototype.AIMove = function(lobby, io) {
  if (!this.gameOver) {
    let piece = this.getRandomPiece();

    if (piece) {
      let possibleMoves = piece.listOfMoves(this.pieces);
    
      let position = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
      let [ x, y ] = position;
    
      piece.moveOrCapture(this.pieces, { x, y }, lobby);
      this.switchColor();
      
      this.isGameEnding(lobby, io);
      
      this.deleteObsoletePieces();
    }
  }
}

//////////////////////////////////////////////////////////////////
// Helper Functions
/////////////////////////////////////////////////////////////////

Chess.prototype.endGame = function(lobby, io, message) {
  lobby.logs.push({ name: 'System', msg: message, role: 'Admin' });
  this.moveHistory[this.moveHistory.length - 1] += '++';
  io.in(lobby.name).emit('Chat Update', lobby.logs);
  io.in(lobby.name).emit('set moves', this.moveHistory);
  this.gameOver = true;
}

Chess.prototype.kingIsInCheck = function() {
  let allyPieces = this.pieces.filter((piece) => piece.player === this.color);

  for (let piece of allyPieces) {
    if (piece.pieceType === 'King' && piece.kingChecked(this.pieces))
      return true;
  }
  return false;
}

Chess.prototype.generateMoveSyntax = function(lobby, io) {
  if (this.color === 'Black') {
    let secondLast = this.moveHistory[this.moveHistory.length - 2];
    let last = this.moveHistory[this.moveHistory.length - 1];

    let newMove = `${secondLast} ${last}`;
    this.moveHistory.splice((this.moveHistory.length - 2), 2);
    this.moveHistory.push(newMove);
    io.in(lobby.name).emit('set moves', this.moveHistory);
  }
}

Chess.prototype.deleteObsoletePieces = function() {
  if (this.piecesToDelete.length > 0) {
    for (let index of this.piecesToDelete)
      this.pieces.splice(index, 1);

    this.piecesToDelete.splice(0, this.piecesToDelete.length);
  }
}

Chess.prototype.getListOfPossibleMoves = function() {
  let allyPieces = this.pieces.filter((piece) => piece.player === this.color);

  var listOfMoves = [];
  for (let piece of allyPieces) {
    let pieceMoveList = piece.listOfMoves(this.pieces);
    if (piece.listOfMoves(this.pieces).length > 0)
      listOfMoves = listOfMoves.concat(pieceMoveList);
  }
  return listOfMoves;
}

Chess.prototype.getKingStates = function() {
  for (let piece of this.pieces) {
    if (piece.pieceType === 'King') {
      if (piece.kingChecked(this.pieces))
        return { inCheck: true, color: piece.player };
    }
  }
  return { inCheck: false, color: "None" };
}

Chess.prototype.getPieceAtPoint = function(pointX, pointY) {
  for (let piece of this.pieces) {
    if (piece.x === pointX && piece.y === pointY) 
      return piece;
  }
  return null;
}

Chess.prototype.switchColor = function() {
  this.color = ( this.color === 'White' ? 'Black' : 'White' );
}

module.exports = Chess;