import { Container } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import { Navbar } from 'src/Components';

export const NavOnlyLayout = (Component: React.ComponentType) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Container>
        <Component />
      </Container>
    </Box>
  );
};
