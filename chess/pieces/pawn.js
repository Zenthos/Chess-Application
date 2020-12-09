const { Piece, linearMove } = require('./base');

function Pawn(name, color, px, py, notation)  {
  Piece.call(this, name, color, px, py, notation); 
  this.moveCount = 0;
}

Pawn.prototype = Object.create(Piece.prototype);
Pawn.prototype.linearMove = linearMove;

Pawn.prototype.listOfMoves = function(pieces) {
  if (this.player === 'White') var possibleMoves = [[-1, -1], [1, -1],  [0, -1], [0, -2]];
  if (this.player === 'Black') var possibleMoves = [[-1, 1], [1, 1], [0, 1], [0, 2]];
  let moves = [];
  for (let [x, y] of possibleMoves) {
    let nextSpot = { x: this.x + x, y: this.y + y };
    if (nextSpot.x > 7 || nextSpot.x < 0 || nextSpot.y > 7 || nextSpot.y < 0) continue;
    if (this.legalMove(pieces, nextSpot)) moves.push([nextSpot.x, nextSpot.y]);
  }
  return moves;
}

Pawn.prototype.kingChecked = function(pieces, spotClicked) {
  if (this.captured === true) return;

  let enemyKing = this.findKing(pieces, this.player == 'White' ? 'Black':'White');

  if (this.player === 'White') var attackableSpots = [[-1, -1], [1, -1]];
  if (this.player === 'Black') var attackableSpots = [[-1, 1], [1, 1]];

  for (let [x, y] of attackableSpots) {
    let spotAttacking = { x: this.x + x, y: this.y + y};
    if (enemyKing.x === spotAttacking.x && enemyKing.y === spotAttacking.y) return this; 
  }
}

Pawn.prototype.verticalMove = function(pieces, spotClicked) {
  let dx = this.x - spotClicked.x;
  let dy = this.y - spotClicked.y;

  if (Math.abs(dx) === 0 && !this.spotOccupied(pieces, spotClicked)) {
    if (this.linearMove(pieces, spotClicked)) {
      if (dy == 2 && this.player == 'White' && this.moveCount === 0) return true;
      if (dy == -2 && this.player == 'Black' && this.moveCount === 0) return true;
    }
    if (dy == 1 && this.player == 'White') return true;
    if (dy == -1 && this.player == 'Black') return true;
  }

  if (Math.abs(dx) == 1 && Math.abs(dy) == 1 && this.spotOccupied(pieces, spotClicked)) {
    if (this.player == 'White' && dy > 0) return true;
    if (this.player == 'Black' && dy < 0) return true;
  }

  return false;
}

Pawn.prototype.legalMove = function(pieces, spotClicked) {
  if (!Piece.prototype.legalMove.call(this, pieces, spotClicked)) return false;
  return this.verticalMove(pieces, spotClicked);
}

module.exports = Pawn;