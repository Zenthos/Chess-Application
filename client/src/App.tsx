import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import * as pages from './Pages';
import { BaseRoute as Route } from './HOCs/BaseRoute';
import PrivateRoute from './HOCs/PrivateRoute';
import 'jquery/dist/jquery.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootswatch/dist/slate/bootstrap.min.css';

function App() {
  return (
    <BrowserRouter>
      <Route path="/" component={pages.Home} />

      <Route path="/play" component={pages.Play} />
      <Route path="/how-to-play" component={pages.Tutorial} />
      <Route path="/shop" component={pages.Shop} />

      <Route path="/login" component={pages.UserPages.Login} />
      <Route path="/register" component={pages.UserPages.Register} />
      <Route path="/profile/:username" component={pages.Profile} />
      <PrivateRoute path="/friends" component={pages.UserPages.Friends} />
      <PrivateRoute path="/settings" component={pages.UserPages.Settings} />

      <Route path="/about" component={pages.About} />

      <Route path="/search" component={pages.Search} />

      <Route path="/forum" component={pages.Forum.Home} />
      <Route path="/forum/:category" component={pages.Forum.Category} />
      <Route path="/forum/:category/:thread" component={pages.Forum.Thread} />

      <Route path="*" component={() => <h1 className="text-center m-3">ERROR 404 NOT FOUND</h1>} />
    </BrowserRouter>
  );
}

export default App;
