import { setBit, getBit } from './Utils';
import { BitBoardType } from './Types';

// Constants

const asciiPieces = ['P', 'N', 'B', 'R', 'Q', 'K', 'p', 'n', 'b', 'r', 'q', 'k'];

// ------------
//  Game Logic
// ------------

export class ChessEngine {
  bitboards: BitBoardType = [
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

  occupancies = {
    'White': 0n,
    'Black': 0n,
    'Both': 0n
  };

  initialize = () => {
    this.parseFEN('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR');
  };

  parseFEN = (fen: string) => {
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
          this.bitboards[index] = setBit((this.bitboards[index] as bigint), square);
        }

        if (piece >= '1' && piece <= '8') {
          file += parseInt(piece, 10) - 1;
        }

        file++;
      }
    }
  };

  convertToPieceArray = () => {
    const pieceArray = [];

    for (let rank = 0; rank < 8; rank++) {
      const rankArray = [];
      for (let file = 0; file < 8; file++) {
        const square = (rank * 8) + file;
        let piece = -1;

        for (let bbPiece = 0; bbPiece <= this.bitboards.length; bbPiece++) {
          if (this.bitboards[bbPiece] && getBit((this.bitboards[bbPiece] as bigint), square)) {
            piece = bbPiece;
          }
        }

        rankArray.push(piece === -1 ? '-' : asciiPieces[piece]);
      }
      pieceArray.push(rankArray);
    }

    return pieceArray;
  };
}

