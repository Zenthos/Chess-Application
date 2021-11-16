import React from 'react';
import { Link } from 'src/Components';
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
              {/* <Link to="/shop" underline>Shop</Link> */}
            </Box>
          </Grid>
          <Grid item xs={6} sm={6} md={4}>
            <Box display="flex" flexDirection="column">
              <Typography variant="h4" color="white">Support</Typography>
              <Link to="/about" underline>Contact</Link>
              <Link to="/about" underline>Terms of Use</Link>
              <Link to="/about" underline>Privacy Policy</Link>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box display="flex" flexDirection="column">
              <Typography variant="h4" color="white">Information</Typography>
              <Typography variant="body1" color="white">
                This website is currently undergoing a major revision, please refer to the
                about page for more information regarding the websites planned updates, current
                status, and about the sole developer.
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: (theme) => theme.palette.mode === 'dark' ? '#555555' : 'white' }} />
        <Box display="flex" justifyContent="center" sx={{ py: 1 }}>
          <Typography variant="caption" color="white" align="center">
            Copyright ChessRooms © {new Date().getFullYear()}
          </Typography>
        </Box>
      </Container>
    </Paper>
  );
};
