import React, { createContext, useState, useEffect } from 'react';
import { UserState } from '@redux';

interface AuthContextType {
  children: React.ReactNode | React.ReactNode[];
}

// Sets context Type, and default values
export const AuthContext = createContext<{
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  isSubmitting: boolean;
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  user: unknown;
  setUser: React.Dispatch<React.SetStateAction<any>>;
}>({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  isSubmitting: false,
  setIsSubmitting: () => {},
  user: {},
  setUser: () => {},
});

export const AuthProvider = ({ children }: AuthContextType) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Authentication is being reworked

    // AuthService.isAuthenticated()
    //   .then(res => {
    //     setUser(res.user);
    //     setIsAuthenticated(res.isAuthenticated);
    //     setIsLoaded(true);
    //   })
    //   .catch((err) => {
    //     setIsLoaded(true);
    //     console.error(err);
    //   });

    setIsLoaded(true);
  }, []);

  return (
    <React.Fragment>
      {isLoaded ? (
        <AuthContext.Provider
          value={{ isAuthenticated, setIsAuthenticated, user, setUser, setIsSubmitting, isSubmitting }}
        >
          {children}
        </AuthContext.Provider>
      ) : null}
    </React.Fragment>
  );
};
