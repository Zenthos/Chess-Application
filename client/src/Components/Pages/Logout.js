import React, { useState, useEffect, useContext } from 'react';
import { Redirect } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthContext';

const Logout = () => {
  const { setUser, setIsAuthenticated } = useContext(AuthContext);
  const [ redirectReady, setRedirectReady ] = useState(false);

  useEffect(() => {
    fetch('/user/logout')
      .then(data => data.json())
      .then(res => {
        setUser({ username: "No Username" });
        setIsAuthenticated(false);
        setRedirectReady(true);
      })
      .catch(err => console.log(err));
  })

  return (
    <>
      { redirectReady ? <Redirect to="/login" /> : null }
    </>
  )
}

export default Logout;