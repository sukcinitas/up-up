import * as passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { comparePassword } from './passwordHashing';
import User, { IUser } from './models/user.model';

passport.use(
  new LocalStrategy(async (username: string, password: string, done) => {
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return done(null, false, {
          message: 'Incorrect username.',
        });
      }
      if (!comparePassword(password, user.password)) {
        return done(null, false, {
          message: 'Incorrect password.',
        });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }),
);

passport.serializeUser((user: IUser, done): void => {
  done(null, user.id);
});

passport.deserializeUser((_id, done) => {
  User.findOne({ _id }, (err: Error, user: any) => {
    done(err, user);
  });
});
