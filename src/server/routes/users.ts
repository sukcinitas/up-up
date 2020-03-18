import { Request, Response } from 'express';
import User, { IUser } from '../models/user.model';
import Poll, { IPoll } from '../models/poll.model';

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
      req.session.user = sessionUser;
      res.json({ redirect: true, sessionUser });
    }
  } catch (err) {
    res.json(`Error: ${err}`);
  }
});

interface LoginRequest extends Request {
  message: any;
}
router.route('/login').post(passport.authenticate('local', { session: true }), (req:LoginRequest, res:Response) => {
  try {
    if (!req.user) {
      res.json({ error: 'Username or password is incorrect!' });
    }
    const sessionUser = sessionizeUser(req.user);
    res.json({ isAuthenticated: true, sessionUser });
  } catch (err) {
    res.json({ error: req.message });
  }
});

router.route('/create-poll').post(async (req:Request, res:Response) => {
  try {
    const {
      name, question, options, createdBy,
    } = req.body;
    const newPoll:IPoll = new Poll({
      name,
      question,
      votes: 0,
      options,
      createdBy,
    });
    await newPoll.save();
    // eslint-disable-next-line no-underscore-dangle
    res.json({ redirect: true, id: newPoll._id });
  } catch (err) {
    res.json(`Error: ${err}`);
  }
});

router.route('/polls/:username').get(async (req:Request, res:Response) => {
  try {
    const polls = await Poll.aggregate([
      { $match: { createdBy: req.params.username } },
      {
        $project: {
          id: '$_id',
          name: 1,
          votes: 1,
          _id: 0,
        },
      },
    ]);
    res.json({ polls });
  } catch (err) {
    res.json(`Error: ${err}`);
  }
});

router.route('/profile/:username').get(async (req:Request, res:Response) => {
  try {
    const user = await User.find({ username: req.params.username }, '-password -createdAt -updatedAt -v');
    res.json({ user });
  } catch (err) {
    res.json(`Error: ${err}`);
  }
});

router.route('/profile').put(async (req:Request, res:Response) => {
  try {
    const { parameter } = req.body;
    if (parameter === 'email') {
      const email = await User.find({ email: req.body.email });
      if (email === []) {
        res.json({ message: 'Email is already in use!' });
      } else {
        await User.findByIdAndUpdate({ _id: req.body.id }, { email: req.body.email });
        res.json({ message: 'Your email has been successfully updated!' });
      }
    } else if (parameter === 'password') {
      const user = await User.findOne({ username: req.body.username });
      if (user && compareSync(req.body.oldpassword, user.password)) {
        user.password = req.body.newpassword;
        await user.save(); // to hash password in pre-save
        res.json({ message: 'Your password has been successfully updated!' });
      } else {
        res.json({ message: 'Password is incorrect!' });
      }
    }
  } catch (err) {
    res.json(`Error: ${err}`);
  }
});

router.route('/profile').delete(async (req:Request, res:Response) => {
  try {
    const { id } = req.body;
    await User.findByIdAndDelete(id);
    req.logout();
    res.end();
  } catch (err) {
    res.json(`Error: ${err}`);
  }
});

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
