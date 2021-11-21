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
    MuiDivider: {
      styleOverrides: {
        fullWidth: {
          margin: '16px 0px',
          borderWidth: 1.5,
          borderColor: mode === 'dark' ? '#555555' : 'rgba(0, 0, 0, 0.87)',
        }
      }
    },
    MuiTabs: {
      defaultProps: {
        textColor: mode === 'dark' ? 'secondary' : 'primary',
        indicatorColor: mode === 'dark' ? 'secondary' : 'primary',
      }
    },
    MuiLink: {
      styleOverrides: {
        underlineAlways: {
          textDecoration: 'none',
          color: 'white'
        },
        underlineHover: {
          textDecoration: 'none',
          color: 'white'
        },
        underlineNone: {
          textDecoration: 'none',
          color: 'white'
        }
      }
    },
    MuiButton: {
      defaultProps: {
        variant: 'contained',
      },
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
