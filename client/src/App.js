import React from 'react';
import { Navbar, Tutorial, Home, About, Play, Profile, Friends, Settings, Login, Logout, Register } from './Components';
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
        <Route exact path="/" component={Home} />
        <PublicRoute path="/login" component={Login} />
        <PublicRoute path="/register" component={Register} />

        <Route path="/play" component={Play} />
        <Route path="/about" component={About} />
        <Route path="/how-to-play" component={Tutorial} />

        <Route path="/profile/:username" component={Profile} />
        <PrivateRoute path="/logout" component={Logout} />
        <PrivateRoute path="/friends" component={Friends} />
        <PrivateRoute path="/settings" component={Settings} />
      </Switch>
    </>
  );
}

export default App;
