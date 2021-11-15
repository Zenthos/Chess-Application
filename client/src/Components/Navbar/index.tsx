import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, AppBar, Toolbar, Typography, Button, Link } from '@mui/material';
import { changeTheme, useAppDispatch, useAppSelector } from 'src/Redux';
import { Switch } from '../Atoms';

export const Navbar = () => {
  const dispatch = useAppDispatch();
  const { theme } = useAppSelector((state) => state.user);
  const toggleTheme = () => dispatch(changeTheme());

  return (
    <AppBar position="static">
      <Toolbar>
        <Link component={RouterLink} to="/">
          <Typography color="white" variant="h6" component="div">
            ChessRooms
          </Typography>
        </Link>
        <Box style={{ flexGrow: 1 }} />
        <Box display="flex" sx={{ px: 0.5 }}>
          <Typography sx={{ px: 1 }}>
            Dark Mode
          </Typography>
          <Switch checked={theme === 'dark'} onChange={toggleTheme} />
        </Box>
        <Button component={RouterLink} to="/shop" color="inherit" sx={{ ml: 0.5 }}>
          Shop
        </Button>
        <Button component={RouterLink} to="/how-to-play" color="inherit" sx={{ ml: 0.5 }}>
          How to Play
        </Button>
        <Button component={RouterLink} to="/about" color="inherit" sx={{ ml: 0.5 }}>
          About
        </Button>
        <Button component={RouterLink} to="/play" color="inherit" sx={{ ml: 0.5 }}>
          Play Chess
        </Button>
        <Button component={RouterLink} to="/login" color="inherit" sx={{ ml: 0.5 }}>
          Login
        </Button>
        <Button component={RouterLink} to="/register" variant="contained" color="secondary" sx={{ ml: 0.5 }}>
          Sign Up
        </Button>
      </Toolbar>
    </AppBar>
  );
};
