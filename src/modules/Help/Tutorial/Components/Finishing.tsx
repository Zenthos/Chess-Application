import React from 'react';
import { Stalemate } from '@public/assets/tutorial-images';
import { Grid, Typography } from '@mui/material';
import { Image } from '@common';


export const Finishing = () => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <Typography variant="h5" sx={{ fontWeight: 600 }} gutterBottom>
          Check, Checkmate, or Stalemate
        </Typography>
        <Typography paragraph>
          When a piece moves in a way that would allow a player to capture the opponent’s king on their next turn, the
          attacking player typically announces “check”.
        </Typography>
        <Typography paragraph>
          The player placed into check must move their king or move another piece to stop the attack on their next turn
          - either by blocking the move or capturing the attacking piece.
        </Typography>
        <Typography paragraph>
          If a player creates a situation where their opponent cannot stop their king from being captured on the next
          turn, the attacking player announces “checkmate” and immediately wins the game. The king is never captured - a
          game of chess is won when a successful checkmate is announced.
        </Typography>
        <Typography paragraph>
          A player can also choose to resign, granting their opponent the victory. Matches can also end in an agreed
          draw - for example, as the result of stalemate leaving a player without any legal moves, or if no player can
          win using available legal moves, a situation known as a “dead position”. One example of a dead position is
          when both players are left with their king as their only remaining piece on the board.
        </Typography>
        <Typography paragraph>
          Draws can also occur as the result of advanced rules typically used in professional tournaments, including
          identical board positions occurring three or five times - rules known respectively as threefold repetition and
          fivefold repetition - or no captures or pawn moves taking place within the last 50 or 75 moves. The exact
          rules used can depend on the tournament and agreement between the players.
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Image src={Stalemate} alt="Stalemate Example" sx={{ width: '100%', height: '100%' }} />
      </Grid>
    </Grid>
  );
};
