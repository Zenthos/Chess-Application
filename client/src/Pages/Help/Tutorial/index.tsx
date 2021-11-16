import React from 'react';
import { Pieces } from './Pieces';
import { Specials } from './Specials';
import { Starting, Finishing, Tabs } from './Components';
import { Divider, Typography } from '@mui/material';

export const Tutorial = () => {
  return (
    <React.Fragment>
      <Typography variant="h4">Your Guide to Beginning Chess</Typography>
      <Divider />
      <Starting />
      <Divider />
      <Typography variant="h5">Rules of the Pieces</Typography>
      <Tabs tabContent={Pieces} />
      <Divider />
      <Finishing />
      <Divider />
      <Typography variant="h5">Special Moves</Typography>
      <Tabs tabContent={Specials} />
    </React.Fragment>
  );
};
