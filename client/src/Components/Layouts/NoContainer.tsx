import React from 'react';
import { Box } from '@mui/system';
import { Navbar } from 'src/Components';

export const NoContainerLayout = (Component: React.ComponentType) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Component />
    </Box>
  );
};
