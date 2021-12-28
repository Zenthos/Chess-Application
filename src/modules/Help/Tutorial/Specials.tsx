import React from 'react';
import * as Images from '@public/assets/tutorial-images';
import { Content } from './Components/Tabs';
import { Typography } from '@mui/material';

export const Specials: Content[] = [
  {
    label: 'Castling',
    image: Images.Checkmate,
    description: (
      <React.Fragment>
        <Typography variant="h5" gutterBottom>
          Castling
        </Typography>
        <Typography paragraph>
          Castling is perhaps the most complicated basic rule in chess, and a rule that many beginners often overlook as
          a result.
        </Typography>
        <Typography paragraph>
          Castling is permitted when a player’s king piece and a rook have not yet moved during the game. Castling can
          be performed with either rook, as long as they haven’t moved - in other words, they are still in their
          starting corners on the edge closest to the controlling player.
        </Typography>
        <Typography paragraph>
          Castling involves a player moving the king piece two squares towards the rook with which they are castling,
          before moving the rook to the square that the king moved ‘through’. This effectively puts the rook adjacent on
          the other side of the king, while the king moves two squares towards the space in which the rook started the
          game. Regardless of whether castling is performed with the rook closer to the king (kingside) or one square
          further away (queenside), the king only ever moves two spaces.
        </Typography>
        <Typography paragraph>
          The king cannot be used in a castling manoeuvre if it is currently in check, but a rook can be used in
          castling even if it is under threat from an opponent’s piece - in other words, if it could be captured on the
          opponent’s next turn, or on any of the squares it passes through while performing the move.
        </Typography>
        <Typography paragraph>
          As usual, castling cannot be used to move the king if it would put the king into check. Castling also cannot
          be used if there are any pieces between the king and the rook - the squares between must be clear.
        </Typography>
      </React.Fragment>
    ),
  },
  {
    label: 'Promotion',
    image: Images.Checkmate,
    description: (
      <React.Fragment>
        <Typography variant="h5" gutterBottom>
          Promotion
        </Typography>
        <Typography paragraph>
          If a pawn reaches the opposite edge of the board - the farthest row (rank) from the controlling player - it is
          promoted to another piece: a rook, knight, bishop or queen. The new piece replaces the pawn on its current
          square, and follows the movement rules for the respective piece.
        </Typography>
        <Typography paragraph>
          While most casual players use captured pieces to represent promoted pieces, a pawn can legally be promoted to
          any piece regardless of whether it has been captured. For example, a player may have multiple queens as the
          result of promoting pawns, or multiple bishops able to move along diagonal lines of the same colour depending
          on the square on which the pawn was promoted.
        </Typography>
        <Typography paragraph>There is no limit to the number of pawns that can be promoted.</Typography>
      </React.Fragment>
    ),
  },
  {
    label: 'EnPassant',
    image: Images.Checkmate,
    description: (
      <React.Fragment>
        <Typography variant="h5" gutterBottom>
          En Passant
        </Typography>
        <Typography paragraph>
          En passant - French for ‘in passing’ - is one of the most famous moves in chess. En passant occurs when a pawn
          moves two squares forward as the result of its optional starting move.
        </Typography>
        <Typography paragraph>
          If an opponent’s pawn would have been able to legally capture the moving pawn had it only moved one square
          instead of two, the opponent can declare en passant on their next turn and move their pawn diagonally onto the
          square that the pawn passed through - capturing the pawn as if it had only moved one square.
        </Typography>
        <Typography paragraph>
          En passant must be declared and made as the opponent’s next turn to be legal - otherwise, the player with the
          chance to capture the pawn loses the opportunity.
        </Typography>
      </React.Fragment>
    ),
  },
];
