import { Container } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import { Navbar, Footer } from 'src/Components';

export const DefaultLayout = (Component: React.ComponentType) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Container>
        <Component />
      </Container>
      <Footer />
    </Box>
  );
};
