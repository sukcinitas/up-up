import User from './models/user.model';

const { compareSync } = require('bcryptjs');

import passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return done(null, false, { message: 'Incorrect username.' });
    }
    if (!compareSync(password, user.password)) {
      return done(null, false, { message: 'Incorrect password.' });
    }
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

passport.serializeUser((user:{id:string, username?:string}, done) => {
  done(null, user.id);
});

passport.deserializeUser((_id, done) => {
  User.findOne({ _id }, '-password', (err, user) => {
    done(err, user);
  });
});
