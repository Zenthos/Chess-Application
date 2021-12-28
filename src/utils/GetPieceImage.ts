import * as Images from '@public/assets/chess-images';

export function GetPieceImage(piece: string) {
  switch (piece) {
    // Black pieces are lowercase
    case 'p':
      return Images.Black.Pawn;
    case 'r':
      return Images.Black.Rook;
    case 'b':
      return Images.Black.Bishop;
    case 'n':
      return Images.Black.Knight;
    case 'q':
      return Images.Black.Queen;
    case 'k':
      return Images.Black.King;

    // White pieces are uppercase
    case 'P':
      return Images.White.Pawn;
    case 'R':
      return Images.White.Rook;
    case 'B':
      return Images.White.Bishop;
    case 'N':
      return Images.White.Knight;
    case 'Q':
      return Images.White.Queen;
    case 'K':
      return Images.White.King;

    // Throw error upon bad input
    default:
      throw new Error(`Invalid Piece Given: ${piece}`);
  }
}
