
const pickRandomMove = function(possibleMoves) {
  return possibleMoves[Math.floor(Math.random() * possibleMoves.length - 1)];
}