const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  friends: [mongoose.Types.ObjectId],
  stats: {
    wins: { type: Number, default: 0 },
  },
});

UserSchema.pre('save', function(next) {
  // Hash Password
  bcrypt.hash(this.password, 10, (err, encryption) => {
    if (err) console.log(err);

    this.password = encryption;
    next();
  });
});

UserSchema.methods.comparePassword = function(password, hash, done) {
  bcrypt.compare(password, hash, (err, matching) => {
    if (err)
      return;

    if (!matching)
      return done(null, false, { msg: 'Incorrect Password', type: 'danger' });
    else
      return done(null, this, { msg: "Successfully Logged In!", type: "success" });
  });
}

const User = mongoose.model('User', UserSchema);

module.exports = User;