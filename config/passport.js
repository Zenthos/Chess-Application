const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/UserModel');
const keys = require('./keys').module;
const jwtStrategy = require('passport-jwt').Strategy;

const cookieExtractor = (req) => {
  let token = null;
  if(req && req.cookies){
    token = req.cookies["access_token"];
  }

  return token;
}

passport.use(new LocalStrategy( 
  {
    usernameField: "email", 
    passwordField: "password"
  },
  function(username, password, done) {
    User.findOne({ username }, function(err, user) {
      if (err) 
        return done(err, false, { msg: "An error has occurred", type: "danger" });
      if (!user) 
        return done(null, false, { msg: "No User Found", type: "danger" });

      user.comparePassword(password, user.password, done);
    })
    .catch(err => console.log(err));
  }
));

passport.use(new jwtStrategy({
  jwtFromRequest : cookieExtractor,
  secretOrKey : keys.JWTKey
}, (payload, done) => {
  console.log(payload);
  return done(null, false);
}));