const express = require('express');
const router = express.Router();
const User = require('../models/UserModel');
const passport = require('passport');
const keys = require('../config/keys').module;
const jwt = require('jsonwebtoken');

const getPublicUserData = function(user) {
  if (user) {
    let { username, friends, stats } = user;
    return { username, friends, stats };
  } else {
    console.log("Login Successful, but no user found.")
    return { username: "Error", friends: {}, stats: {} };
  }
}

router.post('/login', (req, res, next) => {
  let messages = [];
  let token = '';
  passport.authenticate('local', { session: false }, function(err, user, info) {  
    if (err) console.log(err);
    // Sign JSON Web Token if Authentication Passes
    if (user) {
      token = jwt.sign({ username: user.username }, keys.JWTKey, {
        algorithm: "HS256",
        expiresIn: "2h",
      })

      res.cookie("access_token", token, { SameSite: "Lax", httpOnly: true, secure: true });
    }

    messages.push(info);
    res.status(200).json({ messages, user: getPublicUserData(user), token });
  })(req, res, next);
});

router.post('/register', (req, res) => {
  const { username, email, password } = req.body;
  let messages = [];

  User.find({ $or: [{ email: email }, { username: username }] })
  .then(users => {
    if (users.length === 0) {
      const newUser = new User({ username: username, email: email, password: password });
      newUser.save()
      messages.push({ msg: "New User Created", type: "success" });
    } else if (users.length === 1) {
      if (users[0].username === username) messages.push({ msg: "Username is taken, please choose a new one", type: "danger" });
      if (users[0].email === email) messages.push({ msg: "Email has already been used, please choose a new one", type: "danger" });
    } else if (users.length === 2) {
      messages.push({ msg: "Username is taken, please choose a new one", type: "danger" });
      messages.push({ msg: "Email has already been used, please choose a new one", type: "danger" });
    } else {
      messages.push({ msg: "Server Error - Please Use Different Email Or Username", type: "danger" });
    }

    res.status(200).json({ messages })
  })
  .catch(err => console.log(err));
});

router.post('/profile', (req, res) => {
  User.findOne({ username: req.body.username })
  .then(user => {
    if (user)
      res.status(200).json({ userExists: true, user: getPublicUserData(user) });
    else
      res.status(401).json({ userExists: false, user: null });
  })
  .catch(err => console.log(err));
});

router.get('/logout', (req, res) => {
  res.clearCookie('access_token');
  res.status(200).json({ success: true, msg: "Successfully Logged Out!" });
});

router.get('/authenticated', (req, res) => {
  if (req.cookies.access_token)  {
    jwt.verify(req.cookies.access_token, keys.JWTKey, (err, decoded) => {
      if (err) res.clearCookie('access_token');
  
      res.status(200).json({ isAuthenticated: true, user: getPublicUserData(decoded) });
    });
  } else {
    res.status(200).json({ isAuthenticated: false, user: {username: ""} });
  }
});

module.exports = router;