import React from 'react';
import * as pages from './Pages';
import { BaseRoute as Route } from './HOCs/BaseRoute';
import PrivateRoute from './HOCs/PrivateRoute';
import Switch from 'react-router-transition-switch'
import Fader from 'react-fader'
import 'jquery/dist/jquery.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootswatch/dist/slate/bootstrap.min.css';

function App() {
  return (
    <>
      <Switch component={Fader}>
        <Route exact path="/" component={pages.Home} />
        <Route path="/login" hideFooter={true} component={pages.Login} />
        <Route path="/register" hideFooter={true} component={pages.Register} />

        <Route path="/play" hideFooter={true} component={pages.Play} />
        <Route path="/about" component={pages.About} />
        <Route path="/how-to-play" component={pages.Tutorial} />
        <Route path="/shop" component={pages.Shop} />

        <Route path="/profile/:username" component={pages.Profile} />
        <Route path="/search" component={pages.Search} />
        <PrivateRoute path="/friends" component={pages.Friends} />
        <PrivateRoute path="/settings" component={pages.Settings} />

        <Route path="*" component={() => <h1 className="m-3">ERROR 404 NOT FOUND</h1>} />
      </Switch>
    </>
  );
}

export default App;
