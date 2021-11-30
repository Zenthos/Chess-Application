import { getBit, setBit, removeBit, getIndexOfLS1B, encodeMove } from '../Utils';
import { Occupancies } from '../Types';

// Generates which tiles a Bishop can attack from the given square, taking into account blocking bits
export function generateBishopFlyAttacks(square: number, block: bigint) {
  const targetRank = Math.floor(square / 8);
  const targetFile = square % 8;
  let attacks = 0n;

  for (let rank = targetRank + 1, file = targetFile + 1; rank <= 7 && file <= 7; rank++, file++) {
    attacks |= (1n << (BigInt(rank) * 8n + BigInt(file)));
    if ((1n << (BigInt(rank) * 8n + BigInt(file))) & block) break;
  }

  for (let rank = targetRank - 1, file = targetFile + 1; rank >= 0 && file <= 0; rank--, file++) {
    attacks |= (1n << (BigInt(rank) * 8n + BigInt(file)));
    if ((1n << (BigInt(rank) * 8n + BigInt(file))) & block) break;
  }

  for (let rank = targetRank + 1, file = targetFile - 1; rank <= 7 && file >= 0; rank++, file--) {
    attacks |= (1n << (BigInt(rank) * 8n + BigInt(file)));
    if ((1n << (BigInt(rank) * 8n + BigInt(file))) & block) break;
  }

  for (let rank = targetRank - 1, file = targetFile - 1; rank >= 0 && file >= 0; rank--, file--) {
    attacks |= (1n << (BigInt(rank) * 8n + BigInt(file)));
    if ((1n << (BigInt(rank) * 8n + BigInt(file))) & block) break;
  }

  return attacks;
}

// Generates which tiles a Bishop can attack from the given square, used for Magic BitBoard
export function generateBishopAttacksMask(square: number) {
  const targetRank = Math.floor(square / 8);
  const targetFile = square % 8;
  let attacks = 0n;

  for (let rank = targetRank + 1, file = targetFile + 1; rank <= 6 && file <= 6; rank++, file++) {
    attacks |= (1n << (BigInt(rank) * 8n + BigInt(file)));
  }

  for (let rank = targetRank - 1, file = targetFile + 1; rank >= 1 && file <= 6; rank--, file++) {
    attacks |= (1n << (BigInt(rank) * 8n + BigInt(file)));
  }

  for (let rank = targetRank + 1, file = targetFile - 1; rank <= 6 && file >= 1; rank++, file--) {
    attacks |= (1n << (BigInt(rank) * 8n + BigInt(file)));
  }

  for (let rank = targetRank - 1, file = targetFile - 1; rank >= 1 && file >= 1; rank--, file--) {
    attacks |= (1n << (BigInt(rank) * 8n + BigInt(file)));
  }

  return attacks;
}

// Generate all the moves a Bishop can do, depending on the side to move
export function generateBishopMoves(occupancies: Occupancies, side: keyof Occupancies, capturesOnly = false) {
  const moves = [];
  const piece = 18;
  let bitboard = setBit(0n, 20);

  while (bitboard > 0) {
    const fromSquare = getIndexOfLS1B(bitboard);
    const bishopAttacks = generateBishopAttacksMask(fromSquare);
    let attacks = bishopAttacks & ~occupancies[side];

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
