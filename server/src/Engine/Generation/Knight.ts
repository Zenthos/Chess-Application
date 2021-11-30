import { getBit, setBit, removeBit, getIndexOfLS1B, encodeMove } from '../Utils';
import { notAFile, notHFile, notABFile, notHGFile } from '../Constants';
import { Occupancies } from '../Types';

// Generates which tiles a knight can attack from the given square
export function generateKnightAttacksMask(square: number) {
  const bitboard = setBit(0n, square);
  let attacks = 0n;

  if ((bitboard >> 17n) & notHFile)
    attacks |= (bitboard >> 17n);
  if ((bitboard >> 15n) & notAFile)
    attacks |= (bitboard >> 15n);
  if ((bitboard >> 10n) & notHGFile)
    attacks |= (bitboard >> 10n);
  if ((bitboard >> 6n) & notABFile)
    attacks |= (bitboard >> 6n);

  if ((bitboard << 17n) & notAFile)
    attacks |= (bitboard << 17n);
  if ((bitboard << 15n) & notHFile)
    attacks |= (bitboard << 15n);
  if ((bitboard << 10n) & notABFile)
    attacks |= (bitboard << 10n);
  if ((bitboard << 6n) & notHGFile)
    attacks |= (bitboard << 6n);

  return attacks;
}

// Generate all the moves a knight can do, depending on the side to move
export function generateKnightMoves(occupancies: Occupancies, side: keyof Occupancies, capturesOnly = false) {
  const moves = [];
  const piece = 17;
  let bitboard = setBit(0n, 20);

  while (bitboard > 0) {
    const fromSquare = getIndexOfLS1B(bitboard);
    const knightAttacks = generateKnightAttacksMask(fromSquare);
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
