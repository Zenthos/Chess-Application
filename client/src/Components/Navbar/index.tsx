import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Box, AppBar, Toolbar, Typography, Button, Link } from '@mui/material';
import { changeTheme, useAppDispatch, useAppSelector } from 'src/Redux';
import { Switch } from '../Atoms';

export const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { theme } = useAppSelector((state) => state.user);
  const toggleTheme = () => dispatch(changeTheme());

  return (
    <AppBar position="static">
      <Toolbar>
        <Link component={RouterLink} to="/" style={{ flexGrow: 1 }}>
          <Typography color="white" variant="h6" component="div">
              ChessRooms
          </Typography>
        </Link>
        <Box display="flex" sx={{ px: 1 }}>
          <Typography sx={{ px: 1 }}>
              Dark Mode
          </Typography>
          <Switch checked={theme === 'dark'} onChange={toggleTheme} />
        </Box>
        <Button component={RouterLink} to="/shop" color="inherit">
            Shop
        </Button>
        <Button component={RouterLink} to="/how-to-play" color="inherit">
            How to Play
        </Button>
        <Button component={RouterLink} to="/about" color="inherit">
            About
        </Button>
        <Button component={RouterLink} to="/play" color="inherit">
            Play Chess
        </Button>
        <Button component={RouterLink} to="/login" color="inherit">
            Login
        </Button>
        <Button component={RouterLink} to="/register" variant="contained" color="secondary">
            Sign Up
        </Button>
      </Toolbar>
    </AppBar>
  );
};
