const { Piece } = require('./base');

function Knight(name, color, px, py, notation)  {
  Piece.call(this, name, color, px, py, notation);
}

Knight.prototype = Object.create(Piece.prototype);

Knight.prototype.listOfMoves = function(pieces) {
  let possibleMoves = [[2, 1], [2, -1], [-2, 1], [-2, -1], [1, 2], [1, -2], [-1, 2], [-1, -2]];
  let moves = [];
  for (let [x, y] of possibleMoves) {
    let nextSpot = { x: this.x + x, y: this.y + y };
    if (nextSpot.x > 7 || nextSpot.x < 0 || nextSpot.y > 7 || nextSpot.y < 0) continue;
    if (this.legalMove(pieces, nextSpot)) moves.push([nextSpot.x, nextSpot.y]);
  }
  return moves;
}

Knight.prototype.kingChecked = function(pieces) {
  let possibleMoves = [[2, 1], [2, -1], [-2, 1], [-2, -1], [1, 2], [1, -2], [-1, 2], [-1, -2]];
  if (this.captured === true) return;

  let enemyKing = this.findKing(pieces, this.player == 'White' ? 'Black':'White');

  for (let [x, y] of possibleMoves) {
      let spotAttacking = { x: this.x + x, y: this.y + y};
      if (enemyKing.x === spotAttacking.x && enemyKing.y === spotAttacking.y) return true; 
  }
}

Knight.prototype.legalMove = function(pieces, spotClicked) {
  let possibleMoves = [[2, 1], [2, -1], [-2, 1], [-2, -1], [1, 2], [1, -2], [-1, 2], [-1, -2]];
  if (!Piece.prototype.legalMove.call(this, pieces, spotClicked)) return false;

  // Calculate distance of spotclicked from current position and see if result is in possible move
  let dx = this.x - spotClicked.x;
  let dy = this.y - spotClicked.y;
  for (let [x, y] of possibleMoves) {
      if (x == dx && y == dy) return true
  }

  return false;
}

module.exports = Knight;