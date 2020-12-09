const { Piece, linearMove } = require('./base');

function Rook(name, color, px, py, notation)  {
  Piece.call(this, name, color, px, py, notation); 
  this.moveCount = 0;
}

Rook.prototype = Object.create(Piece.prototype);
Rook.prototype.linearMove = linearMove;

Rook.prototype.listOfMoves = function(pieces) {
  let possibleMoves = {
    'u': [[-7, 0], [-6, 0], [-5, 0], [-4, 0], [-3, 0], [-2, 0], [-1, 0]],
    'l': [[7, 0], [6, 0], [5, 0], [4, 0], [3, 0], [2, 0], [1, 0]],
    'r': [[0, -7], [0, -6], [0, -5], [0, -4], [0, -3], [0, -2], [0, -1]],
    'd': [[0, 7], [0 ,6], [0, 5], [0, 4], [0, 3], [0, 2], [0, 1]]
  };
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

Rook.prototype.legalMove = function(pieces, spotClicked) {
  if (!Piece.prototype.legalMove.call(this, pieces, spotClicked)) return false;
  return this.linearMove(pieces, spotClicked)
}

module.exports = Rook;