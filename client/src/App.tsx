import React from 'react';
import { Theme } from './Styles/GlobalTheme';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { AppRouter } from './Router';
import { useAppSelector } from './Redux';

function App() {
  const { theme } = useAppSelector((state) => state.user);

  return (
    <ThemeProvider theme={Theme(theme)}>
      <CssBaseline />
      <AppRouter />
    </ThemeProvider>
  );
}

export default App;
