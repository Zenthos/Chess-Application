import React from 'react';
import * as Pages from '../Pages';
import Authenticator from './Authenticator';
import { Routes, Route } from 'react-router';
import { PrivateRoutes } from './Private';
import { PublicRoute } from './Public';

export const AppRouter = () => {
  return (
    <Routes>
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
  );
};
