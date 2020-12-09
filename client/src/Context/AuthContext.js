import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export default ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    fetch('/user/authenticate')
      .then(data => data.json())
      .then(res => {
        if (res.username !== '')
          setIsAuthenticated(true);

        setIsLoaded(true);
      })
      .catch(err => console.log(err));
  }, []);

  return (
    <div>
      { !isLoaded ? <h1>Server is not operating...</h1> : 
      <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }} >
        { children }
      </AuthContext.Provider>}
    </div>
  )
};