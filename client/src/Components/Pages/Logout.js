import React, { useState, useEffect, useContext } from 'react';
import { Redirect } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthContext';

const Logout = () => {
  const { setIsAuthenticated } = useContext(AuthContext);
  const [ redirectReady, setRedirectReady ] = useState(false);

  useEffect(() => {
    setIsAuthenticated(false);

    fetch('/user/logout')
      .then(data => data.json())
      .then(res => setRedirectReady(true))
      .catch(err => console.log(err));
  })

  return (
    <>
      { redirectReady ? <Redirect to="/login" /> : null }
    </>
  )
}

export default Logout;