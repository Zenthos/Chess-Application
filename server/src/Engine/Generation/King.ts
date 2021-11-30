import { getBit, setBit, removeBit, getIndexOfLS1B, encodeMove } from '../Utils';
import { notAFile, notHFile } from '../Constants';
import { Occupancies } from '../Types';

// Generates which tiles a King can attack from the given square
export function generateKingAttacksMask(square: number) {
  const bitboard = setBit(0n, square);
  let attacks = 0n;

  if (bitboard >> 8n) attacks |= (bitboard >> 8n);
  if ((bitboard >> 9n) & notHFile) attacks |= (bitboard >> 9n);
  if ((bitboard >> 7n) & notAFile) attacks |= (bitboard >> 7n);
  if ((bitboard >> 1n) & notHFile) attacks |= (bitboard >> 1n);

  if (bitboard << 8n) attacks |= (bitboard << 8n);
  if ((bitboard << 9n) & notAFile) attacks |= (bitboard << 9n);
  if ((bitboard << 7n) & notHFile) attacks |= (bitboard << 7n);
  if ((bitboard << 1n) & notAFile) attacks |= (bitboard << 1n);

  return attacks;
}

// Generate all the moves a King can do, depending on the side to move
export function generateKingMoves(occupancies: Occupancies, side: keyof Occupancies, capturesOnly = false) {
  const moves = [];
  const piece = 16;
  let bitboard = setBit(0n, 20);

  while (bitboard > 0) {
    const fromSquare = getIndexOfLS1B(bitboard);
    const knightAttacks = generateKingAttacksMask(fromSquare);
    let attacks = knightAttacks & ~occupancies[side];

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
