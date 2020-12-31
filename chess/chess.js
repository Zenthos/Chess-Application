const { Rook, Knight, Bishop, Queen, King, Pawn } = require('./pieces');

const Chess = function(playingNpc) {
  this.pieces = [];
  this.toDelete = [];
  this.color = 'White';
  this.selectedPiece = null;
  this.gameOver = false;
  this.moveHistory = [];
  this.piecesToDelete = [];
  this.promoting = false;
  this.playingNpc = playingNpc;
}

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

Chess.prototype.handleClick = function(clickX, clickY, lobby, socket, io, selection) {
  let newSpot = { x: clickX, y: clickY };
  let selected = this.selectedPiece;
  
  if (((selected.x !== newSpot.x || selected.y !== newSpot.y) && selected.legalMove(this.pieces, newSpot)) || this.promoting) {
    selected.moveOrCapture(this.pieces, newSpot, lobby);
    selected.availableTiles.splice(0, selected.availableTiles.length);

    if (this.promoting) {
      let promotionLetter = { 'Rook' : 'R', 'Knight': 'N', 'Bishop': 'B', 'Queen': 'Q' };
      this.promotion(selected, selection);
      this.promoting = false;
      this.moveHistory[this.moveHistory.length - 1] += `=${promotionLetter[selection]}`

    } else {
      if ([0, 7].includes(newSpot.y) && selected.pieceType === 'Pawn') {
        socket.emit('select a piece');
        this.promoting = true;
      }

      if (this.color === 'Black') {
        this.generateMoveSyntax();
        io.in(lobby.name).emit('set moves', this.moveHistory);
      }

      this.switchColor();
    }

    if (this.kingIsInCheck()) {
      if (this.kingIsInCheckMate()) {
        lobby.logs.push({ 
          name: 'System', 
          msg: `${this.color} has been Checkmated! ${this.color === 'White' ? 'Black' : 'White'} has won!`, 
          role: 'Admin'
        });
  
        this.moveHistory[this.moveHistory.length - 1] += '++';
        io.in(lobby.name).emit('Chat Update', lobby.logs);
        io.in(lobby.name).emit('set moves', this.moveHistory);
        this.gameOver = true;
      } else {
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
  
  if (!this.promoting) {
    this.selectedPiece.selected = false;
    this.selectedPiece = null;
  }

  if (this.piecesToDelete.length > 0) {
    for (let index of this.piecesToDelete)
      this.pieces.splice(index, 1);

    this.piecesToDelete.splice(0, this.piecesToDelete.length);
  }
}

Chess.prototype.promotion = function(selected, option) {
  let otherColor = (this.color === 'White' ? 'Black' : 'White');
  for (let [index, piece] of this.pieces.entries()) {
    if (piece.pieceType === 'Pawn' &&  piece.player === otherColor && piece.x === selected.x && piece.y === selected.y) {
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
}

Chess.prototype.select = function(clickX, clickY) {
  for (let piece of this.pieces) {
    if (piece.x === clickX && piece.y === clickY && piece.player === this.color) {
      this.selectedPiece = piece;
      piece.selected = true;
      piece.availableTiles = piece.listOfMoves(this.pieces)
      break;
    }
  }
}

Chess.prototype.getListOfPossibleMoves = function() {
  let listOfMoves = [];
  for (let piece of this.pieces) {
    let pieceMoveList = piece.listOfMoves(this.pieces);
    if (pieceMoveList.length !== 0 && piece.player === this.color)
      listOfMoves.concat(pieceMoveList);
  }
  return listOfMoves;
}

Chess.prototype.generateMoveSyntax = function() {
  let secondLast = this.moveHistory[this.moveHistory.length - 2];
  let last = this.moveHistory[this.moveHistory.length - 1];

  let newMove = `${secondLast} ${last}`;
  this.moveHistory.splice((this.moveHistory.length - 2), 2);
  this.moveHistory.push(newMove);
}

Chess.prototype.kingIsInCheckMate = function() {
  let noAvailableMoves = true;
  for (let piece of this.pieces) {
    if (piece.listOfMoves(this.pieces).length !== 0)
      noAvailableMoves = false;
  }
  return noAvailableMoves;
}

Chess.prototype.kingIsInCheck = function() {
  for (let piece of this.pieces) {
    if (piece.pieceType === 'King' && piece.player === this.color) {
      if (piece.kingChecked(this.pieces))
        return true;
    }
  }
  return false;
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