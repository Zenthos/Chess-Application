import { getBit, setBit, removeBit, getIndexOfLS1B, encodeMove } from '../Utils';
import { notAFile, notHFile } from '../Constants';
import { Occupancies, Pieces } from '../Types';
import { generateBishopAttacksMask } from '.';

// Generates which tiles a Pawn can attack from the given square
export function generatePawnAttacksMask(square: number, side: keyof Occupancies) {
  const bitboard = setBit(0n, square);
  let attacks = 0n;

  if (side === 'White') {
    if ((bitboard >> 7n) & notAFile)
      attacks |= bitboard >> 7n;
    if ((bitboard >> 9n) & notHFile)
      attacks |= bitboard >> 9n;
  }

  if (side === 'Black') {
    if ((bitboard << 7n) & notHFile)
      attacks |= bitboard << 7n;
    if ((bitboard << 9n) & notAFile)
      attacks |= bitboard << 9n;
  }

  return attacks;
}

// Generate all the moves a Pawn can do, depending on the side to move
export function generatePawnMoves(occupancies: Occupancies, side: keyof Occupancies, bb: bigint, capturesOnly = false) {
  const piece = (side === 'White') ? 15 : 14;
  const emptySquares = ~occupancies[side];
  const moves = [];

  let bitboard = bb;
  let attacks: bigint;

  const ableToPush = (bitboard: bigint, empty: bigint) => ( (side === 'White' ? (empty << 8n) : (empty >> 8n)) & bitboard );
  const ableToDoublePush = (bitboard: bigint, empty: bigint) => {
    const targetRank = side === 'White' ? 0x000000FF00000000n : 0x00000000FF000000n;
    const emptyRank = (side === 'White' ? ((empty & targetRank) << 8n) : ((empty & targetRank) >> 8n)) & empty;
    return ableToPush(bitboard, emptyRank);
  };

  const pSinglePush = ableToPush(bitboard, emptySquares);
  const pDoublePush = ableToDoublePush(bitboard, emptySquares);

  console.log(bitboard);
  while (bitboard) {
    const fromSquare = getIndexOfLS1B(bitboard);
    const toSquare = side === 'White' ? fromSquare - 8 : fromSquare + 8;

    if (!capturesOnly) {
      // single push
      if (getBit(bitboard, fromSquare) & pSinglePush) {
        // promotion
        if (side === 'White' ? toSquare <= 7 : toSquare >= 56) {
          moves.push(encodeMove(fromSquare, toSquare, piece, side === 'White' ? Pieces.Q : Pieces.q, 0, 0, 0, 0));
          moves.push(encodeMove(fromSquare, toSquare, piece, side === 'White' ? Pieces.R : Pieces.r, 0, 0, 0, 0));
          moves.push(encodeMove(fromSquare, toSquare, piece, side === 'White' ? Pieces.B : Pieces.b, 0, 0, 0, 0));
          moves.push(encodeMove(fromSquare, toSquare, piece, side === 'White' ? Pieces.N : Pieces.n, 0, 0, 0, 0));
        }
        else {
          moves.push(encodeMove(fromSquare, toSquare, piece, 0, 0, 0, 0, 0));
        }
      }

      // double push
      if (getBit(bitboard, fromSquare) & pDoublePush) {
        moves.push(encodeMove(fromSquare, side === 'White' ? (fromSquare - 16) : (fromSquare + 16), piece, 0, 0, 1, 0, 0));
      }
    }

    // attacks
    attacks = generateBishopAttacksMask(fromSquare) & occupancies[side];

    while (attacks) {
      const targetSquare = getIndexOfLS1B(attacks);

      // pawn attack to promotion
      if (side === 'White' ? targetSquare <= 7 : targetSquare >= 56) {
        moves.push(encodeMove(fromSquare, targetSquare, piece, side === 'White' ? Pieces.Q : Pieces.q, 1, 0, 0, 0));
        moves.push(encodeMove(fromSquare, targetSquare, piece, side === 'White' ? Pieces.R : Pieces.r, 1, 0, 0, 0));
        moves.push(encodeMove(fromSquare, targetSquare, piece, side === 'White' ? Pieces.B : Pieces.b, 1, 0, 0, 0));
        moves.push(encodeMove(fromSquare, targetSquare, piece, side === 'White' ? Pieces.N : Pieces.n, 1, 0, 0, 0));
      } else {
        moves.push(encodeMove(fromSquare, targetSquare, piece, 0, 1, 0, 0, 0));
      }

      attacks = removeBit(attacks, targetSquare);
    }

    bitboard = removeBit(bitboard, fromSquare);
  }

  return moves;
}
