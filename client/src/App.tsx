import React from 'react';
import * as Pages from './Pages';
import { Routes, Route } from 'react-router';
import PrivateRoute from './HOCs/PrivateRoute';
import { Navbar, Footer } from './Components';
import 'jquery/dist/jquery.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootswatch/dist/slate/bootstrap.min.css';

function App() {
  return (
    <React.Fragment>
      <Navbar />
      <Routes>
        <Route path="/" element={Pages.Home()} />

        <Route path="/play" element={Pages.Play()} />
        <Route path="/how-to-play" element={Pages.Tutorial()} />
        <Route path="/shop" element={Pages.Shop()} />

        <Route path="/login" element={Pages.Login()} />
        <Route path="/register" element={Pages.Register()} />
        <Route path="/profile/:username" element={Pages.Profile()} />

        <Route path="/" element={<PrivateRoute />}>
          <Route path="/friends" element={Pages.Friends()} />
          <Route path="/settings" element={Pages.Settings()} />
        </Route>

        <Route path="/about" element={Pages.About()} />

        <Route path="/search" element={Pages.Search()} />

        <Route path="/forum" element={Pages.ForumHub()} />
        <Route path="/forum/:category" element={Pages.Category()} />
        <Route path="/forum/:category/:thread" element={Pages.Thread()} />

        <Route path="*" element={<h1 className="text-center m-3">ERROR 404 NOT FOUND</h1>} />
      </Routes>
      <Footer />
    </React.Fragment>
  );
}

export default App;
