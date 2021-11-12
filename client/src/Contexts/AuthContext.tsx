import React, { createContext, useState, useEffect } from 'react';
import { AuthService } from '../Services/AuthService';

// Sets context Type, and default values
export const AuthContext = createContext<{
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  isSubmitting: boolean;
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  user: any;
  setUser: React.Dispatch<React.SetStateAction<any>>;
}>({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  isSubmitting: false,
  setIsSubmitting: () => {},
  user: {},
  setUser: () => {},
});

export interface AuthContextType {
  children: React.ReactNode | React.ReactNode[];
}

const AuthContextProvider = ({ children }: AuthContextType) => {
  const [user, setUser] = useState(null);
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
      .catch((err) => {
        setIsLoaded(true);
        console.error(err);
      });
  }, []);

  return (
    <div>
      { isLoaded ?
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, user, setUser, setIsSubmitting, isSubmitting }} >
          { children }
        </AuthContext.Provider>
        :
        null
      }
    </div>
  );
};

export default AuthContextProvider;
