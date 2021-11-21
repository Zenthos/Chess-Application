import React from 'react';
import { Grid } from '@mui/material';
import { Board } from './Components';

export const Practice = () => {
  return (
    <Grid container spacing={4} sx={{ p: 3 }}>
      <Grid item xs={12} sm={8}>
        <Board />
      </Grid>
      <Grid item xs={12} sm={4}>
        Practice Options Will Go Here
      </Grid>
    </Grid>
  );
};
