const { Piece, linearMove, diagonalMove } = require('./base');

function Queen(name, color, px, py, notation)  {
  Piece.call(this, name, color, px, py, notation);
}

Queen.prototype = Object.create(Piece.prototype);
Queen.prototype.linearMove = linearMove;
Queen.prototype.diagonalMove = diagonalMove;

Queen.prototype.listOfMoves = function(pieces) {
  let possibleMoves = {
    'tl': [[-7, -7], [-6, -6], [-5, -5], [-4, -4], [-3, -3], [-2, -2], [-1, -1]],
    'dl': [[-7, 7], [-6, 6], [-5, 5], [-4, 4], [-3, 3], [-2, 2], [-1, 1]],
    'tr': [[7, -7], [6, -6], [5, -5], [4, -4], [3, -3], [2, -2], [1, -1]],
    'dr': [[7, 7], [6, 6], [5, 5], [4, 4], [3, 3], [2, 2], [1, 1]],
    'u': [[-7, 0], [-6, 0], [-5, 0], [-4, 0], [-3, 0], [-2, 0], [-1, 0]],
    'l': [[7, 0], [6, 0], [5, 0], [4, 0], [3, 0], [2, 0], [1, 0]],
    'r': [[0, -7], [0, -6], [0, -5], [0, -4], [0, -3], [0, -2], [0, -1]],
    'd': [[0, 7], [0 ,6], [0, 5], [0, 4], [0, 3], [0, 2], [0, 1]]
  }
  let moves = [];
  for (let direction in possibleMoves) {
    for (let [x, y] of possibleMoves[direction]) {
      let nextSpot = { x: this.x + x, y: this.y + y };
      if (nextSpot.x > 7 || nextSpot.x < 0 || nextSpot.y > 7 || nextSpot.y < 0) continue;
      if (this.legalMove(pieces, nextSpot)) moves.push([nextSpot.x, nextSpot.y]);
    }
  }
  return moves;
}

Queen.prototype.legalMove = function(pieces, spotClicked) {
  if (!Piece.prototype.legalMove.call(this, pieces, spotClicked)) return false;
  if (this.linearMove(pieces, spotClicked)) return true;
  if (this.diagonalMove(pieces, spotClicked)) return true;
  return false;
}

module.exports = Queen;