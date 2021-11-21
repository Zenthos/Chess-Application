import { White, Black } from 'src/Assets/chess-images';

export function GetPieceImage(piece: string) {
  switch (piece) {
    // Black pieces are lowercase
    case 'p': return Black.Pawn;
    case 'r': return Black.Rook;
    case 'b': return Black.Bishop;
    case 'n': return Black.Knight;
    case 'q': return Black.Queen;
    case 'k': return Black.King;

    // White pieces are uppercase
    case 'P': return White.Pawn;
    case 'R': return White.Rook;
    case 'B': return White.Bishop;
    case 'N': return White.Knight;
    case 'Q': return White.Queen;
    case 'K': return White.King;

    // Throw error upon bad input
    default:
      throw new Error(`Invalid Piece Given: ${piece}`);
  }
}
