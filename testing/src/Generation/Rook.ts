import { getBit, setBit, removeBit, getIndexOfLS1B, encodeMove } from '../Utils';
import { Occupancies } from '../Types';

// Generates which tiles a Rook can attack from the given square
export function generateRookAttacksMask(square: number) {
  const targetRank = Math.floor(square / 8);
  const targetFile = square % 8;
  let attacks = 0n;

  // <= 6 to make sure we don't go to the very edge of the board
  for (let rank = targetRank + 1; rank <= 7; rank++) {
    attacks |= (1n << (BigInt(rank) * 8n + BigInt(targetFile)));
  }

  for (let rank = targetRank - 1; rank >= 0; rank--) {
    attacks |= (1n << (BigInt(rank) * 8n + BigInt(targetFile)));
  }

  for (let file = targetFile + 1; file <= 7; file++) {
    attacks |= 1n << (BigInt(targetRank) * 8n + BigInt(file));
  }

  for (let file = targetFile - 1; file >= 0; file--) {
    attacks |= 1n << (BigInt(targetRank) * 8n + BigInt(file));
  }

  return attacks;
}

// Generate all the moves a Rook can do, depending on the side to move
export function generateRookMoves(occupancies: Occupancies, side: keyof Occupancies, capturesOnly = false) {
  const moves = [];
  const piece = 20;
  let bitboard = setBit(0n, 20);

  while (bitboard > 0) {
    const fromSquare = getIndexOfLS1B(bitboard);
    const queenAttacks = generateRookAttacksMask(fromSquare);
    let attacks = queenAttacks & ~occupancies[side];

    while (attacks > 0) {
      const toSquare = getIndexOfLS1B(attacks);
      const isCapture = getBit(side === 'White' ? occupancies['Black'] : occupancies['White'], toSquare);

      if (!capturesOnly && !isCapture) {
        moves.push(encodeMove(fromSquare, toSquare, piece, 0, 0, 0, 0, 0));
      } else if (isCapture) {
        moves.push(encodeMove(fromSquare, toSquare, piece, 0, 1, 0, 0, 0));
      }

      attacks = removeBit(attacks, toSquare);
    }

    bitboard = removeBit(bitboard, fromSquare);
  }

  return moves;
}
