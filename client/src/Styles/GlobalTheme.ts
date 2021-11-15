import { createTheme, PaletteMode } from '@mui/material';

export const Theme = (mode: PaletteMode) => createTheme({
  palette: {
    mode,
    background: {
      default: mode === 'dark' ? '#303030' : '#fafafa',
      paper: mode === 'dark' ? '#121212' : '#fff',
    },
    primary: {
      main: '#2c3e50',
    },
    secondary: {
      main: '#7f8c8d',
    },
    error: {
      main: '#e74c3c',
    },
    warning: {
      main: '#f39c12',
    },
    info: {
      main: '#3498db',
    },
    success: {
      main: '#18bc9c',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        contained: {
          textTransform: 'none',
        },
        text: {
          textTransform: 'none',
          '&:hover': {
            color: '#18bc9c'
          }
        }
      }
    }
  }
});
