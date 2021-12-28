import React, { useContext } from 'react';
import { AuthContext } from '@common';

export const Profile = () => {
  const { user, isAuthenticated } = useContext(AuthContext);

  return <div>User Profile Here</div>;
};
