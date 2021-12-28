import { getBit, setBit, removeBit, getIndexOfLS1B, encodeMove } from '../Utils';
import { generateBishopAttacksMask } from './Bishop';
import { generateRookAttacksMask } from './Rook';
import { Occupancies } from '../EngineTypes';

// Generates which tiles a Queen can attack from the given square
export function generateQueenAttacksMask(square: number) {
  return (generateBishopAttacksMask(square) | generateRookAttacksMask(square));
}

// Generate all the moves a Queen can do, depending on the side to move
export function generateQueenMoves(occupancies: Occupancies, side: keyof Occupancies, capturesOnly = false) {
  const moves = [];
  const piece = 19;
  let bitboard = setBit(0n, 20);

  while (bitboard > 0) {
    const fromSquare = getIndexOfLS1B(bitboard);
    const queenAttacks = generateQueenAttacksMask(fromSquare);
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
