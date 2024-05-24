import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { comparePassword } from './passwordHashing';
import User, { IUser } from './models/user.model';

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
        return done(err);
      }
    },
  ),
);

passport.serializeUser((user: Express.User, done): void => {
  // @ts-ignore
  done(null, user.id);
});

passport.deserializeUser(async (_id, done) => {
  try {
    const user = User.findOne({ _id });
    done(null, user);
  } catch (err) {
    done(err, null)
  }
});
