import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

export interface UserType {
  username: string;
  email: string;
  password: string;
  friends: mongoose.ObjectId[];
  stats: {
    wins: number;
    whiteWins: number;
    blackWins: number;
    dateCreated: Date;
    lastActive: Date;
  };
  settings: {
    theme: string;
  };
  comparePassword: (password: string, hashed: string, done: () => unknown) => unknown;
}

const UserSchema = new mongoose.Schema<UserType>({
  username: { type: String, required: true, unique: true, trim: true, minlength: 5 },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  friends: [mongoose.Types.ObjectId],
  stats: {
    wins: { type: Number, default: 0 },
    whiteWins: { type: Number, default: 0 },
    blackWins: { type: Number, default: 0 },
    dateCreated: { type: Date, default: Date.now },
    lastActive: { type: Date, default: Date.now },
  },
  settings: {
    theme: { type: String },
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


UserSchema.methods['comparePassword'] = function(password, hash, done) {
  bcrypt.compare(password, hash, (err, matching) => {
    if (err) {
      console.log(err);
      return done(null, false, { msg: 'An error has occurred during login.', type: 'danger' });
    }

    if (!matching)
      return done(null, false, { msg: 'Incorrect Password', type: 'danger' });
    else
      return done(null, this, { msg: 'Successfully Logged In! Please Wait...', type: 'success' });
  });
};

export const User = mongoose.model<UserType>('User', UserSchema, 'users');
