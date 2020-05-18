import { Request, Response } from 'express';
import User, { IUser } from '../models/user.model';
import UserController from '../controllers/user.controller';

const router = require('express').Router();
const { compareSync } = require('bcryptjs');

import passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const sessionizeUser = (user) => ({ userId: user.id, username: user.username });

type SessionRequest = Request & {
  session: Express.Session;
  sessionID: string;
};

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


router.route('/register').post(async (req:SessionRequest, res:Response) => {
  // process.on('unhandledRejection', function(err) {
  //     console.log(err);
  // });

  try {
    // will need validation
    const user = await User.findOne({ username: req.body.user.username });
    const email = await User.findOne({ email: req.body.user.email });
    if (user && email) {
      res.json({
        username_taken: true,
        email_taken: true,
      });
    } else if (user) {
      res.json({ username_taken: true });
    } else if (email) {
      res.json({ email_taken: true });
    } else {
      const newUser:IUser = new User({
        username: req.body.user.username,
        email: req.body.user.email,
        password: req.body.user.password,
      });

      await newUser.save();

      const sessionUser = sessionizeUser(newUser);
      res.json({ redirect: true, sessionUser });
    }
  } catch (err) {
    res.json(`Error: ${err}`);
  }
});

interface LoginRequest extends Request {
  message: any;
}

router.route('/login').post((req:LoginRequest, res:Response, next) => {
  // eslint-disable-next-line consistent-return
  passport.authenticate('local', { session: true }, (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.json({ error: 'Username or password is incorrect!' });
    }
    req.login(user, (loginErr) => {
      if (loginErr) {
        return next(loginErr);
      }
      return res.json({ isAuthenticated: true, sessionUser: sessionizeUser(user) });
    });
  })(req, res, next);
});

router.route('/profile/:username').get(UserController.getUser);
router.route('/profile').delete(UserController.deleteUser);
router.route('/profile').put(UserController.updateUser);

router.route('/logout').get(async (req:Request, res:Response) => {
  try {
    req.logout();
    res.end();
    // req.session.destroy(() => {
    //   res.clearCookie('connect.sid');
    //    res.end();
    // });
  } catch (err) {
    res.json(`Error: ${err}`);
  }
});

router.route('/login').get((req:Request, res:Response) => {
  try {
    res.json({ user: sessionizeUser(req.user) });
  } catch (err) {
    res.json(`Error: ${err}`);
  }
});

module.exports = router;
