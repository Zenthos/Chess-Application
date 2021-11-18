import React from 'react';
import { Grid } from '@mui/material';
import { Engine } from './Engine';

export const Play = () => {
  return (
    <Grid container spacing={4} sx={{ p: 3 }}>
      <Grid item xs={12} sm={8}>
        <Engine />
      </Grid>
      <Grid item xs={12} sm={4}>
        Chat Interface Will Go Here
      </Grid>
    </Grid>
  );
};
