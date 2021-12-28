import React from 'react';
import { Starting as StartingImage } from '@public/assets/tutorial-images';
import { Grid, Typography } from '@mui/material';
import { Image } from '@common';


export const Starting = () => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <Typography variant="h5" sx={{ fontWeight: 600 }} gutterBottom>
          Setting Up The Board
        </Typography>
        <Typography paragraph>
          Chess is played by two players on a chess board measuring eight-by-eight squares. The 64 squares alternate
          between light and dark colours - traditionally, black and white. When properly set up, a white square should
          be the rightmost square along the edge closest to each player.
        </Typography>
        <Typography paragraph>
          Players’ pieces are set up in the two horizontal rows (known as ranks) closest to each player. The second rank
          - ie. the second row from the player’s perspective - consists of a line of eight pawns, each placed on a
          single square.
        </Typography>
        <Typography paragraph>
          The closer rank is nearly symmetrical, with rooks (also known as castles) placed on the two leftmost and
          rightmost corner squares, followed by knights on the inside space next to them, then bishops.
        </Typography>
        <Typography paragraph>
          The two central squares of the rank are occupied by the king and queen. The queen is placed on the square
          matching her colour (for example, the black queen on the black square), with the king occupying the remaining
          square of the opposite colour. This means that the king and queen of each colour face each other, making the
          correct setup symmetrical between the two players.
        </Typography>
        <Typography paragraph>
          The white player takes the first move, with players alternating single turns until a player is defeated via
          checkmate or resigns. A draw can also be agreed. If playing with an optional timer, as in tournaments, the
          first player to run out of time forfeits the game.
        </Typography>
      </Grid>

      <Grid item xs={12} sm={6}>
        <Image src={StartingImage} alt="Starting Position Example" sx={{ width: '100%', height: '100%' }} />
      </Grid>
    </Grid>
  );
};
