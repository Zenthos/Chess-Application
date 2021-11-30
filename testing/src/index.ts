import { printBoard, printMoves, setBit, getBit } from './Utils';
import { Occupancies, BitBoardType, Pieces } from './Types';
import { generatePawnMoves } from './Generation';

// ------------
//  Game Logic
// ------------

const bitboards: BitBoardType = [
  0n, // P
  0n, // N
  0n, // B
  0n, // R
  0n, // Q
  0n, // K
  0n, // p
  0n, // n
  0n, // b
  0n, // r
  0n, // q
  0n, // k
];

const asciiPieces = ['P', 'N', 'B', 'R', 'Q', 'K', 'p', 'n', 'b', 'r', 'q', 'k'];

const occupancies = {
  'White': 0n,
  'Black': 0n,
  'Both': 0n
};

// -----------------
//  Testing Grounds
// -----------------

function parseFEN(fen: string) {
  const sections = fen.split(' ');
  if (!sections || sections.length < 0) return;

  const pieces = sections[0]?.split('/');
  if (!pieces) return;

  for (let rank = 0; rank < 8; rank++) {
    let file = 0;
    for (const piece of (pieces[rank]?.split('') as string[])) {
      const square = (rank * 8) + file;
      const index = asciiPieces.findIndex((ascii) => ascii === piece);

      if (index !== -1) {
        bitboards[index] = setBit((bitboards[index] as bigint), square);
      }

      if (piece >= '1' && piece <= '8') {
        file += parseInt(piece, 10) - 1;
      }

      file++;
    }
  }
}

function convertToPieceArray() {
  const pieceArray = [];

  for (let rank = 0; rank < 8; rank++) {
    const rankArray = [];
    for (let file = 0; file < 8; file++) {
      const square = (rank * 8) + file;
      let piece = -1;

      for (let bbPiece = 0; bbPiece <= bitboards.length; bbPiece++) {
        if (bitboards[bbPiece] && getBit((bitboards[bbPiece] as bigint), square)) {
          piece = bbPiece;
        }
      }

      rankArray.push(piece === -1 ? '.' : asciiPieces[piece]);
    }
    pieceArray.push(rankArray);
  }

  console.table(pieceArray);
}

function isSquareAttacked(square: number, side: keyof Occupancies) {
  let bishopsQueens: bigint;
  let rooksQueens: bigint;
  let pawnBoard: bigint;
  let knightBoard: bigint;
  let kingBoard: bigint;

  if (side === 'White') {
    bishopsQueens = bitboards[Pieces.B] | bitboards[Pieces.Q];
    rooksQueens = bitboards[Pieces.R] | bitboards[Pieces.Q];
    pawnBoard = bitboards[Pieces.P];
    knightBoard = bitboards[Pieces.N];
    kingBoard = bitboards[Pieces.K];
  } else {
    bishopsQueens = bitboards[Pieces.b] | bitboards[Pieces.q];
    rooksQueens = bitboards[Pieces.r] | bitboards[Pieces.q];
    pawnBoard = bitboards[Pieces.p];
    knightBoard = bitboards[Pieces.n];
    kingBoard = bitboards[Pieces.k];
  }

  // if (pawnAttacks[square] & pawnBoard)
  //   return 1;

  // if (knightAttacks[square] & knightBoard)
  //   return 1;

  // if (GetBishopAttacks(square, occupancies['Both']) & bishopsQueens)
  //   return 1;

  // if (GetRookAttacks(square, occupancies['Both']) & rooksQueens)
  //   return 1;

  // if (kingAttacks[square] & kingBoard)
  //   return 1;

  return 0;
}

// convertToPieceArray();

parseFEN('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR');
convertToPieceArray();

// const moves = generatePawnMoves(occupancies, 'Black', bitboards[Pieces.p]);
// printMoves(moves);
