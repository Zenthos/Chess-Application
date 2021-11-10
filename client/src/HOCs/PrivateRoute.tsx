import React, { useContext } from 'react';
import { Navigate, PathRouteProps } from 'react-router';
import { BaseRoute } from './BaseRoute';
import { AuthContext } from '../Context/AuthContext';

export interface PrivateRouteType extends PathRouteProps {
  component: () => React.ReactElement;
}

const PrivateRoute = ({ component: Component, ...rest }: PrivateRouteType) => {
  const { isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) return <Navigate to="/login" />;

  return <BaseRoute {...rest} component={Component} />;
};

export default PrivateRoute;
