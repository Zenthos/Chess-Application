import React from 'react';
import Link from 'next/link';
import { Box, Paper, Container, Divider, Grid, Typography } from '@mui/material';

export const Footer = () => {
  return (
    <Paper
      component="footer"
      sx={{
        pt: 4,
        mt: 'auto',
        bgcolor: (theme) => (theme.palette.mode === 'light' ? theme.palette.primary.main : undefined),
      }}
    >
      <Container>
        <Grid container spacing={3}>
          <Grid item xs={6} sm={6} md={3}>
            <Box display="flex" flexDirection="column">
              <Typography variant="h4" color="white">
                Chess
              </Typography>
              <Link href="/chess/play">Play</Link>
              <Link href="/tutorial/how-to-play">Learn</Link>
              <Link href="/chess/practice">Practice</Link>
              <Link href="/shop">Shop</Link>
            </Box>
          </Grid>
          <Grid item xs={6} sm={6} md={3}>
            <Box display="flex" flexDirection="column">
              <Typography variant="h4" color="white">
                Social
              </Typography>
              <Link href="/about">About</Link>
              <Link href="/forum/hub">Forum</Link>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box display="flex" flexDirection="column">
              <Typography variant="h4" color="white">
                Support
              </Typography>
              <Link href="/about">Contact</Link>
              <Link href="/about">Terms of Use</Link>
              <Link href="/about">Privacy Policy</Link>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box display="flex" flexDirection="column">
              <Typography variant="h4" color="white">
                Information
              </Typography>
              <Typography variant="body1" color="white">
                This website is currently undergoing a major revision, please refer to the about page for more
                information regarding the websites planned updates, current status, and about the sole developer.
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: (theme) => (theme.palette.mode === 'dark' ? '#555555' : 'white') }} />
        <Box display="flex" justifyContent="center" sx={{ py: 1 }}>
          <Typography variant="caption" color="white" align="center">
            Copyright ChessRooms © {new Date().getFullYear()}
          </Typography>
        </Box>
      </Container>
    </Paper>
  );
};
