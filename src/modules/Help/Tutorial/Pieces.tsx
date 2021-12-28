import React from 'react';
import * as Images from '@public/assets/tutorial-images';
import { Content } from './Components/Tabs';
import { Typography } from '@mui/material';

export const Pieces: Content[] = [
  {
    label: 'Pawn',
    image: [Images.Pawn1, Images.Pawn2],
    description: (
      <React.Fragment>
        <Typography variant="h5" gutterBottom>
          Pawn
        </Typography>
        <Typography paragraph>
          Pawns move one square forward in a straight line. They cannot move horizontally, diagonally or backwards.
        </Typography>
        <Typography paragraph>
          An exception to this is if a pawn is yet to be moved during the game. If a pawn has not yet moved, it may be
          moved two squares forward as a single move. Both squares must be empty. The player can also choose to move the
          piece a single square.
        </Typography>
        <Typography paragraph>
          The only time a pawn may move diagonally is when capturing an opponent’s piece. Pawns may capture an
          opponent’s piece on either of the diagonal spaces to the left or right ahead of the piece. As part of
          capturing the piece, the pawn will move diagonally to replace the captured piece. A pawn cannot capture an
          adjacent piece on any other square, or move diagonally without capturing.
        </Typography>
      </React.Fragment>
    ),
  },
  {
    label: 'Rook',
    image: Images.Rook,
    description: (
      <React.Fragment>
        <Typography variant="h5" gutterBottom>
          Rook
        </Typography>
        <Typography paragraph>
          The rook, sometimes called the castle, can move any number of squares horizontally along its current row
          (rank) or column (file). It cannot pass through pieces of the same colour, and can capture pieces of the
          opposite colour by moving onto an occupied space. It cannot move diagonally for any reason.
        </Typography>
      </React.Fragment>
    ),
  },
  {
    label: 'Knight',
    image: Images.Knight,
    description: (
      <React.Fragment>
        <Typography variant="h5" gutterBottom>
          Knight
        </Typography>
        <Typography paragraph>
          Knights are the only chess piece that may be moved ‘through’ other pieces by ‘jumping’ over them. It captures
          pieces as normal by landing on a space occupied by a piece of the opposite colour and cannot move to a square
          occupied by a piece of the same colour, but may move over pieces of either colour during its move.
        </Typography>
        <Typography paragraph>
          Knights move in a fixed ‘L’ pattern: two squares forward, backward, left or right, then one square
          horizontally or vertically, or vice versa - one square forward, backward, left or right, followed by two
          squares horizontally or vertically to complete the ‘L’ shape.
        </Typography>
        <Typography paragraph>
          This means that the knight can always move to the closest square that is not on its current row (rank), column
          (file) or directly adjacent diagonally.
        </Typography>
        <Typography paragraph>
          The knight must move the full distance - it cannot move just two squares in a straight line without also
          moving one to the side, for instance.
        </Typography>
      </React.Fragment>
    ),
  },
  {
    label: 'Bishop',
    image: Images.Bishop,
    description: (
      <React.Fragment>
        <Typography variant="h5" gutterBottom>
          Bishop
        </Typography>
        <Typography paragraph>
          The bishop can move any number of squares diagonally - this means it always moves along the diagonal line of
          squares matching the current colour of its square. This means that each player begins the game with one bishop
          that can move on each colour. A bishop cannot move horizontally or vertically for any reason. It cannot move
          through pieces of the same colour, and captures a piece of the opposite colour by moving onto its square.
        </Typography>
      </React.Fragment>
    ),
  },
  {
    label: 'Queen',
    image: Images.Queen,
    description: (
      <React.Fragment>
        <Typography variant="h5" gutterBottom>
          Queen
        </Typography>
        <Typography paragraph>
          The queen may move any number of squares horizontally, vertically or diagonally. These movements must be made
          in a single straight line during a single turn. (In other words, you can’t move three squares diagonally,
          followed by three spaces vertically.) The queen cannot move through pieces of the same colour, and captures a
          piece of the opposite colour by moving onto its square.
        </Typography>
      </React.Fragment>
    ),
  },
  {
    label: 'King',
    image: Images.King,
    description: (
      <React.Fragment>
        <Typography variant="h5" gutterBottom>
          King
        </Typography>
        <Typography paragraph>
          The king moves a single space horizontally, vertically or diagonally. The king cannot move into a space that
          would grant a check or checkmate to the opponent player.
        </Typography>
        <Typography paragraph>
          As an exception to all other chess pieces, the king is never captured - a player loses the match when the king
          is placed into checkmate, which would lead to an unavoidable capture on the opponent’s next turn.
        </Typography>
      </React.Fragment>
    ),
  },
];
