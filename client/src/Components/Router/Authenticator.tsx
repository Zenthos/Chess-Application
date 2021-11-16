import React, { useContext } from 'react';
import { AuthContext } from 'src/Contexts/AuthContext';
import { Navigate } from 'react-router';

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
