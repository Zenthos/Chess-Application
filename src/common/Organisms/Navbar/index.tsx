import React, { useState } from 'react';
import { Box, AppBar, Toolbar, Typography, Button, IconButton, useTheme, useMediaQuery } from '@mui/material';
import { changeTheme, useAppDispatch, useAppSelector } from '@redux';
import { Menu } from '@mui/icons-material';
import { Switch } from '@common';
import { Drawer } from './Components';
import { navOptions } from './Options';
import Link from 'next/link';


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
        <Link href="/" passHref>
          <Typography color="white" variant="h6" component="div" sx={{ cursor: 'pointer' }} >
            Home
          </Typography>
        </Link>
        <Box style={{ flexGrow: 1 }} />
        <Box display="flex" sx={{ px: 0.5 }}>
          <Typography sx={{ px: 1 }}>Dark Mode</Typography>
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
              <Link key={path} href={path} passHref>
                <Button variant={variant || 'text'} color={color || 'inherit'} sx={{ ml: 0.5 }}>
                  {text}
                </Button>
              </Link>
            ))}
          </React.Fragment>
        )}
      </Toolbar>
    </AppBar>
  );
};
