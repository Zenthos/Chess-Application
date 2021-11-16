import React from 'react';
import { useNavigate } from 'react-router';
import { navOptions } from '../Options';
import { Close } from '@mui/icons-material';
import {
  Drawer as MuiDrawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';

interface DrawerProps {
  display: boolean;
  setDisplay: (option: boolean) => void;
}

export const Drawer = ({ display, setDisplay }: DrawerProps) => {
  const navigate = useNavigate();

  const onNavigate = (path: string) => {
    setDisplay(false);
    navigate(path);
  };

  return (
    <MuiDrawer
      anchor="right"
      open={display}
      onClose={() => setDisplay(false)}
      transitionDuration={350}
      PaperProps={{
        sx: {
          width: '100%',
          bgcolor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.primary.main
              : undefined,
        }
      }}
    >
      <ListItem
        secondaryAction={
          <IconButton onClick={() => setDisplay(false)}>
            <Close sx={{ color: 'white' }} />
          </IconButton>
        }
      >
        <ListItemText primary="Select an option below" sx={{ color: 'white' }} />
      </ListItem>

      <List>
        {navOptions.map(({ path, text, Icon }) => (
          <ListItem button key={path} onClick={() => onNavigate(path)} >
            <ListItemIcon>
              {Icon && (<Icon sx={{ color: 'white' }} />)}
            </ListItemIcon>
            <ListItemText primary={text} sx={{ color: 'white' }}/>
          </ListItem>
        ))}
      </List>
    </MuiDrawer>
  );
};
