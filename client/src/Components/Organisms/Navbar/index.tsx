import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, AppBar, Toolbar, Typography, Button, IconButton, Link, useTheme, useMediaQuery } from '@mui/material';
import { changeTheme, useAppDispatch, useAppSelector } from 'src/Redux';
import { Menu } from '@mui/icons-material';
import { Switch } from 'src/Components';
import { Drawer } from './Components';
import { navOptions } from './Options';

export const Navbar = () => {
  const dispatch = useAppDispatch();
  const { theme } = useAppSelector((state) => state.user);
  const toggleTheme = () => dispatch(changeTheme());

  const muiTheme = useTheme();
  const isMedScreen = useMediaQuery(muiTheme.breakpoints.down('md'));

  const [displayDrawer, setDisplayDrawer] = useState(false);

  return (
    <AppBar position="static">
      <Toolbar>
        <Link component={RouterLink} to="/" style={{ textDecoration: 'none' }}>
          <Typography color="white" variant="h6" component="div">
            Home
          </Typography>
        </Link>
        <Box style={{ flexGrow: 1 }} />
        <Box display="flex" sx={{ px: 0.5 }}>
          <Typography sx={{ px: 1 }}>
            Dark Mode
          </Typography>
          <Switch checked={theme === 'dark'} onChange={toggleTheme} />
        </Box>

        {isMedScreen ? (
          <React.Fragment>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mx: 2 }}
              onClick={() => setDisplayDrawer(true)}
            >
              <Menu />
            </IconButton>
            <Drawer display={displayDrawer} setDisplay={setDisplayDrawer} />
          </React.Fragment>
        ) : (
          <React.Fragment>
            {navOptions.map(({ path, text, variant, color }) => (
              <Button
                key={path}
                to={path}
                component={RouterLink}
                variant={variant || 'text'}
                color={color || 'inherit'} sx={{ ml: 0.5 }}
              >
                {text}
              </Button>
            ))}
          </React.Fragment>
        )}
      </Toolbar>
    </AppBar>
  );
};
