import React from 'react';
import { NextPage } from 'next';
import { AppProps } from 'next/app';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { Hydrate } from 'react-query/hydration';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider as ReduxProvider } from 'react-redux';
import { AuthProvider } from '@common';
import { Theme } from '@styles';
import { store } from '@redux';
import '@styles/global.css';

type NextPageWithLayout = NextPage & {
  getLayout?: (page: React.ReactElement) => React.ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

function MyApp({ Component, pageProps }: AppPropsWithLayout): JSX.Element {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout || ((page) => page)

  // For use with react-query
  const queryClient = new QueryClient();

  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <AuthProvider>
            <ReduxProvider store={store}>
              <ThemeProvider theme={Theme('dark')}>
                <CssBaseline />
                <Component {...pageProps} />
              </ThemeProvider>
            </ReduxProvider>
          </AuthProvider>
        </Hydrate>
      </QueryClientProvider>
    </React.StrictMode>
  );
}

export default MyApp;
