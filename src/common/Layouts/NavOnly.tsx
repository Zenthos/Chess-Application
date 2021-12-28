import React from 'react';
import { Box } from '@mui/system';
import { Container } from '@mui/material';
import { Navbar } from '@common';

export const NavOnlyLayout = (Component: React.ComponentType) => {
  return () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Container sx={{ py: 2 }}>
        <Component />
      </Container>
    </Box>
  );
};
