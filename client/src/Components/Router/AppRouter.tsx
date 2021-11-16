import React from 'react';
import ScrollToTop from './ScrollToTop';
import Authenticator from './Authenticator';
import { Routes, Route, useLocation } from 'react-router';
import { PrivateRoutes } from './Private';
import { PublicRoute } from './Public';

export const AppRouter = () => {
  const location = useLocation();

  return (
    <ScrollToTop>
      <Routes location={location}>
        {PublicRoute.map((route) => (
          <Route {...route} key={route.key} />
        ))}

        {PrivateRoutes.map(({ key, path, redirect, element }) => (
          <Route
            key={key}
            path={path}
            element={(
              <Authenticator redirect={redirect}>
                {element}
              </Authenticator>
            )}
          />
        ))}
      </Routes>
    </ScrollToTop>
  );
};
