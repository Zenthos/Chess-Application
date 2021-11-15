import React from 'react';
import { Link } from '../Atoms';
import { Box, Paper, Container, Divider, Grid, Typography } from '@mui/material';

export const Footer = () => {
  return (
    <Paper
      component="footer"
      sx={{
        pt: 4,
        mt: 'auto',
        bgcolor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.primary.main
            : undefined,
      }}
    >
      <Container>
        <Grid container>
          <Grid item xs={6} sm={6} md={4}>
            <Box display="flex" flexDirection="column">
              <Typography variant="h4" color="white">Chess</Typography>
              <Link to="/play" underline>Play</Link>
              <Link to="/how-to-play" underline>Learn</Link>
              <Link to="/practice" underline>Practice</Link>
              <Link to="/shop" underline>Shop</Link>
            </Box>
          </Grid>
          <Grid item xs={6} sm={6} md={4}>
            <Box display="flex" flexDirection="column">
              <Typography variant="h4" color="white">Legal</Typography>
              <Link to="/about" underline>Privacy</Link>
              <Link to="/about" underline>Terms</Link>
              <Link to="/about" underline>Contact</Link>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box display="flex" flexDirection="column">
              <Typography variant="h4" color="white">Information</Typography>
              <Typography variant="body1" color="white">
                ChessRooms is a website built entirely by one person, complete with networking,
                online transactions, login system, data saving, expanding forum, and complete Chess
                Engine that includes an AI opponent.
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ py: 2, borderColor: 'white' }} />
        <Box display="flex" justifyContent="center" sx={{ py: 1 }}>
          <Typography variant="caption" color="white" align="center">
            Copyright ChessRooms © {new Date().getFullYear()}
          </Typography>
        </Box>
      </Container>
    </Paper>
  );
};
