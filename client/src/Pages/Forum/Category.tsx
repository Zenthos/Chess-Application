import React, { useContext } from 'react';
import { AuthContext } from 'src/Contexts';

export const Category = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <div>
      Forum Category Page
    </div>
  );
};
