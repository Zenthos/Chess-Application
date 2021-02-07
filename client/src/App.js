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

        <Route path="/play" hideFooter={true} component={pages.Play} />
        <Route path="/how-to-play" component={pages.Tutorial} />
        <Route path="/shop" component={pages.Shop} />

        <Route path="/login" hideFooter={true} component={pages.UserPages.Login} />
        <Route path="/register" hideFooter={true} component={pages.UserPages.Register} />
        <Route path="/profile/:username" component={pages.Profile} />
        <PrivateRoute path="/friends" component={pages.UserPages.Friends} />
        <PrivateRoute path="/settings" component={pages.UserPages.Settings} />

        <Route path="/about" component={pages.About} />
        
        <Route path="/search" component={pages.Search} />

        <Route exact path="/forum" component={pages.Forum.Home} />
        <Route exact path="/forum/:category" component={pages.Forum.Category} />
        <Route path="/forum/:category/:thread" component={pages.Forum.Thread} />

        <Route path="*" hideFooter={true} hideNav={true} component={() => <h1 className="text-center m-3">ERROR 404 NOT FOUND</h1>} />
      </Switch>
    </>
  );
}

export default App;
