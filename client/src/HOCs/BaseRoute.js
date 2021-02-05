import React from 'react';
import { Navbar, Footer } from '../Components';
import { Route } from 'react-router-dom';

export const BaseRoute = ({component: Component, hideNav, hideFooter, ...rest}) => {

  return (
    <>
      <Route {...rest} render={props => {
        return (
        <>
          { hideNav ? null : <Navbar /> }
          <Component {...props} />
          { hideFooter ? null : <Footer /> }
        </>
        )
      }} />
    </>
  )
}
