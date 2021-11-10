import React from 'react';
import { Navbar, Footer } from '../Components';
import { Route, PathRouteProps } from 'react-router-dom';

export interface BaseRouteType extends PathRouteProps {
  component: () => React.ReactElement;
}

export const BaseRoute = ({ component: Component, ...rest }: BaseRouteType) => {
  return (
    <Route {...rest}>
      <Navbar />
      <Component />
      <Footer />
    </Route>
  );
};
