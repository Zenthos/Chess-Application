import React from 'react';
import { Grid } from '@mui/material';
import { Board, Chat } from './Components';
import { SocketProvider } from 'src/Contexts';

export const Play = () => {
  return (
    <SocketProvider>
      <Grid container spacing={4} sx={{ p: 3 }}>
        <Grid item xs={12} sm={8}>
          <Board />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Chat />
        </Grid>
      </Grid>
    </SocketProvider>
  );
};
