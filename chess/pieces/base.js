function Piece(name, color, px, py, notation) {
  this.availableTiles = [];
  this.pieceType = name;
  this.player = color;
  this.notation = notation;
  this.selected = false;
  this.captured = false;
  this.x = px;
  this.y = py;
}

Piece.prototype.spotOccupied = function(pieces, spotClicked) {
  for (let piece of pieces) {
    if (piece.x === spotClicked.x && piece.y === spotClicked.y) return true;
  }
  return false;
}

Piece.prototype.move = function(pieces, spotClicked, lobby) {
  let dx = this.x - spotClicked.x;
  this.x = spotClicked.x;
  this.y = spotClicked.y;

  if (this.pieceType === 'King' && Math.abs(dx) === 2) {
    let side = this.castle(pieces, spotClicked);

    if (side === 'right')
      lobby.game.moveHistory.push('0-0');
    else
      lobby.game.moveHistory.push('0-0-0')

  } else {
    const letter = { '0': 'a', '1': 'b', '2': 'c', '3': 'd', '4': 'e', '5': 'f', '6': 'g', '7': 'h' }; 
    const number = Math.abs(7 - this.y) + 1;
  
    lobby.game.moveHistory.push(`${this.notation}${letter[this.x]}${number}`);
  }

  if (['King', 'Rook', 'Pawn'].includes(this.pieceType))
    this.moveCount++;
}

Piece.prototype.capture = function(pieces, spotClicked, lobby) {
  for (let [index, piece] of pieces.entries()) {
    if (piece.x === spotClicked.x && piece.y === spotClicked.y && !piece.captured && piece.pieceType !== 'King') {
      const letter = { '0': 'a', '1': 'b', '2': 'c', '3': 'd', '4': 'e', '5': 'f', '6': 'g', '7': 'h' }; 
      let notation = (this.pieceType === 'Pawn' ? letter[this.x] : this.notation);

      this.x = spotClicked.x;
      this.y = spotClicked.y;

      if (['King', 'Rook', 'Pawn'].includes(this.pieceType))
        this.moveCount++;

      const number = Math.abs(7 - this.y) + 1;    
      lobby.game.moveHistory.push(`${notation}x${letter[this.x]}${number}`);

      pieces.splice(index, 1);
      return;
    }
  }
}

Piece.prototype.legalMove = function(pieces, spotClicked) {
  // If the piece tries to move onto another piece and its the same color => not a legal move
  if (this.spotOccupied(pieces, spotClicked)) {
    for (let piece of pieces) {
      if (piece.x === spotClicked.x && piece.y === spotClicked.y && !piece.captured && piece.player == this.player) return false;
    }
  }  

  // Not legal move if the move causes friendly king to be in check
  if (this.doesMoveCheckSelf(pieces, spotClicked)) return false;

  return true;
}


Piece.prototype.doesMoveCheckSelf = function(pieces, spotClicked) {
  let previousPosition = { x: this.x, y: this.y };
  let friendlyKing = this.findKing(pieces, this.player);

  // Temporarily Move Piece to new Position
  this.x = spotClicked.x;
  this.y = spotClicked.y;
  for (let piece of pieces) if (piece.x === this.x && piece.y === this.y) piece.captured = true;

  // Does the move leave friendly king in check?
  let result = friendlyKing.kingChecked(pieces);

  // Revert everything back to previous state
  this.x = previousPosition.x;
  this.y = previousPosition.y;
  for (let piece of pieces) if (piece.captured) piece.captured = false;

  return result;
}

Piece.prototype.moveOrCapture = function(pieces, spotClicked, lobby, io) {
  let legal = this.legalMove(pieces, spotClicked);
  let occupied = this.spotOccupied(pieces, spotClicked);

  if (legal) {
    if (occupied)
      this.capture(pieces, spotClicked, lobby, io);   // Move is legal and Tile is Occupied
    else
      this.move(pieces, spotClicked, lobby, io);      // Move is legal but not piece to capture
  }
}

Piece.prototype.findKing = function(pieces, color) {
  for (let piece of pieces) 
    if (piece.pieceType === 'King' && piece.player === color) return piece;
}

// ---------------------------------------- SHARED FUNCTIONS ----------------------------------------

linearMove = function(pieces, spotClicked) {
  let dx = this.x - spotClicked.x;
  let dy = this.y - spotClicked.y;

  // Must be a linear move
  if (Math.abs(dx) !== 0 && Math.abs(dy) !== 0) return false;

  // Move Horizontally
  if (dx !== 0 && dy === 0) {
    let i = dx > 0 ? -1 : 1;
    while(Math.abs(i) < Math.abs(dx)) {
      let nextX = this.x + i;
      for (let piece of pieces) if (piece.x === nextX && piece.y === this.y) return false;
      if (dx < 0) i++;
      if (dx > 0) i--;
    }
  // Move Vertically
  } else {
    let i = dy > 0 ? -1 : 1;
    while(Math.abs(i) < Math.abs(dy)) {
      let nextY = this.y + i;
      for (let piece of pieces)if (piece.x === this.x && piece.y === nextY) return false;
      if (dy < 0) i++;
      if (dy > 0) i--;
    }
  }

  return true;
}

diagonalMove = function(pieces, spotClicked) {
  let dx = this.x - spotClicked.x;
  let dy = this.y - spotClicked.y;

  // Must be a diagonal move
  if (Math.abs(dx) !== Math.abs(dy)) return false;

  // Determines Direction
  let i = dx > 0 ? -1 : 1;
  let k = dy > 0 ? -1 : 1;
  while(Math.abs(i) < Math.abs(dx) && Math.abs(k) < Math.abs(dy)) {
    let nextX = this.x + i;
    let nextY = this.y + k;
    for (let piece of pieces) if (piece.x === nextX && piece.y === nextY) return false;
    if (dx < 0) i++;
    if (dx > 0) i--;
    if (dy < 0) k++;
    if (dy > 0) k--;
  }

  return true;
}

module.exports = { Piece, linearMove, diagonalMove };