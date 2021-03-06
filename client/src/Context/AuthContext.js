import React, { createContext, useState, useEffect } from 'react';
import AuthService from '../Service/AuthService';

export const AuthContext = createContext();

const ContextProvider = ({ children }) => {
  const [user, setUser] =  useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    AuthService.isAuthenticated()
      .then(res => {
        setUser(res.user);
        setIsAuthenticated(res.isAuthenticated);
        setIsLoaded(true);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      { !isLoaded ? null : 
      <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, user, setUser, setIsSubmitting, isSubmitting }} >
        { children }
      </AuthContext.Provider>}
    </div>
  )
};

export default ContextProvider;