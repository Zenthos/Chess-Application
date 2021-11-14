import React, { useContext } from 'react';
import { Outlet, Navigate } from 'react-router';
import { AuthContext } from '../Contexts/AuthContext';

interface AuthenticatorProps {
  redirect: string;
  children: React.ReactElement;
}

const Authenticator = ({ redirect, children }: AuthenticatorProps) => {
  const { isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) return <Navigate to={redirect}/>;

  return children;
};

export default Authenticator;
