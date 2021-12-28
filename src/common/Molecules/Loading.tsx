import { CircularProgress, Typography } from '@mui/material';
import React from 'react';

export const Loading = () => {
  return (
    <div
      style={{
        display: 'grid',
        justifyContent: 'center',
        alignContent:'center',
        textAlign: 'center',
        height: '100vh',
      }}
    >
      <Typography variant='h5'>
        Loading...
      </Typography>
      <CircularProgress color="secondary" size={100}  sx={{ m: 2 }} />
    </div>
  );
}