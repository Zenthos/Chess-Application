import React, { useContext } from 'react';
import { AuthContext } from 'src/Contexts';

export const Profile = () => {
  const { user, isAuthenticated } = useContext(AuthContext);

  return (
    <div>
      User Profile Here
    </div>
  );
};
