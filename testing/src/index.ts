import { printBoard, printMoves, setBit, getBit } from './Utils';

// ------------
//  Game Logic
// ------------

// 0 - Rook
// 1 - Bishop
// 2 - Knight
// 3 - Queen
// 4 - King
// 5 - Pawn
const bitBoards = [0n, 0n, 0n, 0n, 0n, 0n, 0n, 0n, 0n, 0n, 0n, 0n];
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
        bitBoards[index] = setBit((bitBoards[index] as bigint), square);
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

      for (let bbPiece = 0; bbPiece <= bitBoards.length; bbPiece++) {
        if (bitBoards[bbPiece] && getBit((bitBoards[bbPiece] as bigint), square)) {
          piece = bbPiece;
        }
      }

      rankArray.push(piece === -1 ? '.' : asciiPieces[piece]);
    }
    pieceArray.push(rankArray);
  }

  console.table(pieceArray);
}

parseFEN('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR');
convertToPieceArray();
