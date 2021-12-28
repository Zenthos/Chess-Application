import React, { useContext } from 'react';
import { AuthContext } from '@common';

export const Category = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return <div>Forum Category Page</div>;
};
