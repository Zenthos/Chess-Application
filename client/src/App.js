import React from 'react';
import { Navbar, Tutorial, Home, About, Play, Login, Logout, Register } from './Components';
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
        <PrivateRoute path="/logout" component={Logout} />
        <PublicRoute path="/register" component={Register} />
        <Route path="/play" component={Play} />
        <Route path="/about" component={About} />
        <Route path="/how-to-play" component={Tutorial} />
        <PrivateRoute path="/protected" component={() => <h1>Protected Content</h1>} />
      </Switch>
    </>
  );
}

export default App;
