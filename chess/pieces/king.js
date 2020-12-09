const { Piece } = require('./base');

function King(name, color, px, py, notation)  {
  Piece.call(this, name, color, px, py, notation);
  this.moveCount = 0;
}

King.prototype = Object.create(Piece.prototype);

King.prototype.listOfMoves = function(pieces) {
  let possibleMoves = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1], [2, 0], [-2, 0]];
  let moves = [];
  for (let [x, y] of possibleMoves) {
    let nextSpot = { x: this.x + x, y: this.y + y };
    if (nextSpot.x > 7 || nextSpot.x < 0 || nextSpot.y > 7 || nextSpot.y < 0) continue;
    if (this.legalMove(pieces, nextSpot)) moves.push([nextSpot.x, nextSpot.y]);
  }
  return moves;
}

King.prototype.kingChecked = function(pieces) {
  let attackingPieces = [];

  let upRight = this.findPiece(pieces, 1, -1);
  let upLeft = this.findPiece(pieces, -1, -1);
  let downRight = this.findPiece(pieces, 1, 1);
  let downLeft = this.findPiece(pieces, -1, 1);

  attackingPieces.push({ direction: 'upRight', piece: upRight });
  attackingPieces.push({ direction: 'upLeft', piece: upLeft });
  attackingPieces.push({ direction: 'downRight', piece: downRight });
  attackingPieces.push({ direction: 'downLeft', piece: downLeft });

  let up = this.findPiece(pieces, 0, -1);
  let down = this.findPiece(pieces, 0, 1);
  let left = this.findPiece(pieces, -1, 0);
  let right = this.findPiece(pieces, 1, 0);

  attackingPieces.push({ direction: 'up', piece: up });
  attackingPieces.push({ direction: 'down', piece: down });
  attackingPieces.push({ direction: 'left', piece: left });
  attackingPieces.push({ direction: 'right', piece: right });

  // Determines if the king is being attacked by a knight
  for (let piece of pieces) {
    if (piece.pieceType === 'Knight' && piece.player !== this.player) {
      if (piece.kingChecked(pieces)) attackingPieces.push({ direction: 'knight', piece})
    }
  }

  let filtered = attackingPieces.filter(item => item.piece !== undefined);

  if (filtered.length !== 0) {
    for (let attacker of filtered) {
      let piece = attacker.piece;
      let direction = attacker.direction;
      if (piece.captured) continue;
      if (piece.player === this.player) continue;
      if (piece.x === this.x && piece.y === this.y) continue;

      let diagDirections = ['upLeft', 'upRight', 'downLeft', 'downRight'];
      if (piece.pieceType === 'Queen' || piece.pieceType === 'Bishop' || piece.pieceType === 'Pawn') {
        if (piece.pieceType !== 'Pawn') {
          if (piece.pieceType === 'Bishop' && diagDirections.includes(direction)) return true;
          if (piece.pieceType === 'Queen' && diagDirections.includes(direction)) return true;
        } else {
          let dx = Math.abs(this.x - piece.x);
          let dy = Math.abs(this.y - piece.y);
          if (dx !== 1 && dy !== 1) continue;
          if (this.player === 'White' && direction === 'upLeft' || direction === 'upRight') return true;
          if (this.player === 'Black' && direction === 'downLeft' || direction === 'downRight') return true;
        }
      }

      let linearDirections = ['right', 'left', 'up', 'down'];
      if (piece.pieceType === 'Queen' || piece.pieceType === 'Rook') {
        if (linearDirections.includes(direction)) return true;
      } 

      if (direction === 'knight' && piece.pieceType === 'Knight') return true;
    }
  }
  return false;
}   

King.prototype.findPiece = function(pieces, sign1, sign2) {
  for (let i = 1; this.x + i*sign1 <= 7 && this.y + i*sign2 <= 7; i++) {
    let newX = this.x + i*sign1;
    let newY = this.y + i*sign2;
    if (newX > 7 || newX < 0 || newY > 7 || newY < 0) break;
    for (let piece of pieces) {
      if (piece.captured === true) continue;
      if (piece.x === newX && piece.y === newY) return piece;
    }
  }
  return;
}

King.prototype.moveOneSpot = function(spotClicked) {
  let dx = this.x - spotClicked.x;
  let dy = this.y - spotClicked.y;
  if (Math.abs(dx) < 2 && Math.abs(dy) < 2) return true;
  else return false;
}

King.prototype.wantsToCastle = function(pieces, spotClicked) {
  if (this.moveCount !== 0) return false;

  var leftRook, rightRook;
  // Rooks on either side
  for (let piece of pieces) {
    if (piece.pieceType === 'Rook' && this.player === piece.player && piece.x < this.x) leftRook = piece;
    if (piece.pieceType === 'Rook' && this.player === piece.player && piece.x > this.x) rightRook = piece;
  }

  if (leftRook === undefined) return false;

  // Wants to castle left-side
  if (spotClicked.x == 2 && spotClicked.y == this.y) {
    if (leftRook.moveCount !== 0) return false;
    let leftTiles = [{ x: 1, y: this.y }, { x: 2, y: this.y }, { x: 3, y: this.y }];
    let canCastle = true;
    for (let spot of leftTiles) { if (this.spotOccupied(pieces, spot)) canCastle = false };
    return canCastle;
  }

  if (rightRook === undefined) return false;

  // Wants to castle right-side 
  if (spotClicked.x == 6 && spotClicked.y == this.y) {
    if (rightRook.moveCount !== 0) return false;
    let rightTiles = [{ x: 5, y: this.y }, { x: 6, y: this.y }];
    let canCastle = true;
    for (let spot of rightTiles) { if (this.spotOccupied(pieces, spot)) canCastle = false };
    return canCastle;
  }
}

King.prototype.castle = function(pieces, spotClicked) {
  // Rooks on either side
  for (let piece of pieces) {
    if (piece.pieceType === 'Rook' && this.player === piece.player && piece.x < this.x) var leftRook = piece;
    if (piece.pieceType === 'Rook' && this.player === piece.player && piece.x > this.x) var rightRook = piece;
  }
  // Move left side rook
  if (spotClicked.x == 2 && spotClicked.y == this.y) {
    leftRook.x = 3;
    return 'left';
  }// Move right side rook
  if (spotClicked.x == 6 && spotClicked.y == this.y) {
    rightRook.x = 5;
    return 'right';
  }
}

King.prototype.legalMove = function(pieces, spotClicked) {
  if (!Piece.prototype.legalMove.call(this, pieces, spotClicked)) return false;
  if (this.wantsToCastle(pieces, spotClicked)) return true;
  return this.moveOneSpot(spotClicked);
}

module.exports = King;