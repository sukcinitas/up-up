import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { comparePassword } from './passwordHashing';
import User from './models/user.model';

passport.use(
  new LocalStrategy(
    async (username: string, password: string, done) => {
      try {
        const user = await User.findOne({ username });
        if (!user) {
          return done(null, false);
        }
        if (!comparePassword(password, user.password)) {
          return done(null, false);
        }
        return done(null, user);
      } catch (err) {
        return done(err, false);
      }
    },
  ),
);

passport.serializeUser((user: Express.User, done): void => {
  // @ts-ignore
  done(null, user._id);
});

passport.deserializeUser(async (_id, done) => {
  try {
    const user = await User.findOne({ _id });
    done(null, user);
  } catch (err) {
    done(err, null)
  }
});
