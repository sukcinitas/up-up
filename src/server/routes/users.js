const router = require('express').Router();
const { compareSync } = require('bcryptjs');
const passport = require('passport');
const User = require('../models/user.model');
const Poll = require('../models/poll.model');

const sessionizeUser = (user) => ({ userId: user.id, username: user.username });

router.route('/register').post(async (req, res) => {
  // process.on('unhandledRejection', function(err) {
  //     console.log(err);
  // });

  try {
    // will need validation
    const user = await User.find({ username: req.body.username });
    const email = await User.find({ email: req.body.email });
    if (user.length > 0 && email.length > 0) {
      res.json({
        username_taken: true,
        email_taken: true,
      });
    } else if (user.length > 0) {
      res.json({ username_taken: true });
    } else if (email.length > 0) {
      res.json({ email_taken: true });
    } else {
      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
      });

      await newUser.save();

      const sessionUser = sessionizeUser(newUser);
      req.session.user = sessionUser;
      res.json({ redirect: true, sessionUser });
    }
  } catch (err) {
    console.log('register', err);
    res.json(`Error: ${err}`);
  }
});

router.route('/login').post(passport.authenticate('local', { session: true }), (req, res) => {
  try {
    const sessionUser = sessionizeUser(req.user);
    res.json({ isAuthenticated: true, sessionUser });
  } catch (err) {
    res.json(`Error: ${err}`);
  }
});

router.route('/create-poll').post(async (req, res) => {
  try {
    const {
      name, question, options, createdBy,
    } = req.body;
    const newPoll = new Poll({
      name,
      question,
      votes: 0,
      options,
      createdBy,
    });
    await newPoll.save();
    res.json({ redirect: true, id: newPoll._id });
  } catch (err) {
    console.log('create err', err);
    res.json(`Error: ${err}`);
  }
});

router.route('/polls/:username').get(async (req, res) => {
  try {
    const polls = await Poll.find({ created_by: req.params.username });
    res.json({ polls });
  } catch (err) {
    res.json(`Error: ${err}`);
  }
});

router.route('/profile/:username').get(async (req, res) => {
  try {
    const user = await User.find({ username: req.params.username }, '-password');
    res.json({ user });
  } catch (err) {
    res.json(`Error: ${err}`);
  }
});

router.route('/profile').put(async (req, res) => {
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

router.route('/profile').delete(async (req, res) => {
  try {
    const { id } = req.body;
    await User.findByIdAndDelete(id);
    req.logout();
    res.end();
  } catch (err) {
    res.json(`Error: ${err}`);
  }
});

router.route('/logout').delete(async (req, res) => {
  try {
    req.logout();
    res.end();
  } catch (err) {
    res.json(`Error: ${err}`);
  }
});

router.route('/login').get((req, res) => {
  try {
    res.json({ user: sessionizeUser(req.user) });
  } catch (err) {
    res.json(`Error: ${err}`);
  }
});

module.exports = router;
