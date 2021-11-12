import React, { useContext } from 'react';
import { Outlet, Navigate } from 'react-router';
import { AuthContext } from '../Contexts/AuthContext';

const PrivateRoute = () => {
  const { isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) return <Navigate to="/login" />;

  return <Outlet />;
};

export default PrivateRoute;
