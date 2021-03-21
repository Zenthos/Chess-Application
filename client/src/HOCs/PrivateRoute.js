import React, { useContext } from 'react';
import { BaseRoute as Route } from './BaseRoute';
import { Redirect } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';

const PrivateRoute = ({component: Component, ...rest}) => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <Route {...rest} render={props => {
        return isAuthenticated ? <Component {...props} /> : <Redirect to={{ pathname: '/login', state: { from: props.location }}} />
    }} />
  )
}

export default PrivateRoute;