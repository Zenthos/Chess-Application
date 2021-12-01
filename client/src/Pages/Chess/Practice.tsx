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
        <br />
        <br />
        <br />
        <br />
        <h4>Todo List for Chess Pages</h4>
        <ul>
          <li>Incorporate Chess Engine</li>
          <li>Add Animations</li>
          <li>Add Pre-moves</li>
          <li>Chat Functionality</li>
          <li>Online Multiplayer</li>
          <li>Play Against Computer</li>
          <li>Keep track of match outcomes (wins/losses)</li>
        </ul>
      </Grid>
    </Grid>
  );
};
