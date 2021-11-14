import React from 'react';
import { Box, Paper, Container, Divider, Grid, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <Paper
      sx={{
        py: 4,
        mt: 'auto',
        bgcolor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.primary.main
            : undefined,
      }}
      component="footer"
    >
      <Container>
        <Grid container>
          <Grid item xs={6} sm={6} md={4}>
            <Box display="flex" flexDirection="column">
              <Typography variant="h4" color="white">Chess</Typography>
              <Link to="/play">Play</Link>
              <Link to="/how-to-play">Learn</Link>
              <Link to="/practice">Practice</Link>
              <Link to="/shop">Shop</Link>
            </Box>
          </Grid>
          <Grid item xs={6} sm={6} md={4}>
            <Box display="flex" flexDirection="column">
              <Typography variant="h4" color="white">Legal</Typography>
              <Link to="/about">Privacy</Link>
              <Link to="/about">Terms</Link>
              <Link to="/about">Contact</Link>
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
        <Typography variant="caption" color="white">
          Copyright ChessRooms © {new Date().getFullYear()}
        </Typography>
      </Container>
    </Paper>
  );
};
