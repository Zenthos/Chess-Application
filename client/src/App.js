import React from 'react';
import { Navbar } from './Components';
import * as pages from './Pages';
import { Route } from 'react-router-dom';
import PrivateRoute from './HOCs/PrivateRoute';
import PublicRoute from './HOCs/PublicRoute';
import Switch from 'react-router-transition-switch'
import Fader from 'react-fader'
import 'jquery/dist/jquery.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootswatch/dist/slate/bootstrap.min.css';

function App() {
  return (
    <>
      <Navbar />
      <Switch component={Fader}>
        <Route exact path="/" component={pages.Home} />
        <PublicRoute path="/login" component={pages.Login} />
        <PublicRoute path="/register" component={pages.Register} />

        <Route path="/play" component={pages.Play} />
        <Route path="/about" component={pages.About} />
        <Route path="/how-to-play" component={pages.Tutorial} />

        <Route path="/profile/:username" component={pages.Profile} />
        <PrivateRoute path="/logout" component={pages.Logout} />
        <PrivateRoute path="/friends" component={pages.Friends} />
        <PrivateRoute path="/settings" component={pages.Settings} />
      </Switch>
    </>
  );
}

export default App;
