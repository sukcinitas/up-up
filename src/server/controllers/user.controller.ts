import { Request, Response } from 'express';
import User, { IUser } from '../models/user.model';
import UserService from '../services/user.service';

import passport = require('passport');
require('../passportStrategy');

const { compareSync } = require('bcryptjs');

const sessionizeUser = (user) => ({ userId: user.id, username: user.username });

interface LoginRequest extends Request {
  message: any;
}
type SessionRequest = Request & {
  session: Express.Session;
  sessionID: string;
};

const UserController = {
  async getUser(req:Request, res:Response) {
    const { username } = req.params;
    return res.json({ user: await UserService.getUserByUsername(username) });
  },
  async deleteUser(req:Request, res:Response) {
    const { id } = req.body;
    await UserService.deleteUser(id);
    req.logout();
    return res.end();
  },
  // eslint-disable-next-line consistent-return
  async updateUser(req:Request, res:Response) {
    const { parameter } = req.body;
    if (parameter === 'email') {
      const { email, id } = req.body;
      const user = await UserService.getOneUserByEmail(email);
      if (user) {
        return res.json({ message: 'This e-mail is already in use! Try again!' });
      }
      await UserService.updateUserEmail(id, email);
      return res.json({ message: 'Your email has been successfully updated!' });
    } if (parameter === 'password') {
      const { username, oldpassword, newpassword } = req.body;
      const user = await UserService.getOneUserByUsername(username);
      if (user && compareSync(oldpassword, user.password)) {
        user.password = newpassword;
        await user.save(); // to hash password in pre-save
        return res.json({ message: 'Your password has been successfully updated!' });
      }
      return res.json({ message: 'Password is incorrect!' });
    }
  },
  async logout(req:Request, res:Response) {
    try {
      await req.logout();
      return res.end();
    } catch (err) {
      return err;
    }
  },
  checkIfLoggedIn(req:Request, res:Response) {
    try {
      if (!req.user) {
        return res.json({ user: sessionizeUser({ id: '', username: '' }) });
      }
      return res.json({ user: sessionizeUser(req.user) });
    } catch (err) {
      return err;
    }
  },
  authenticate(req:LoginRequest, res:Response, next) {
    try {
      // eslint-disable-next-line consistent-return
      return passport.authenticate('local', { session: true }, (err, user) => {
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
    } catch (err) {
      return err;
    }
  },
  async register(req:SessionRequest, res:Response) {
    try {
      const { username, email } = req.body.user;
      const user = await UserService.getOneUserByUsername(username);
      const user2 = await UserService.getOneUserByEmail(email);
      if (user && user2) {
        return res.json({
          username_taken: true,
          email_taken: true,
        });
      } if (user) {
        return res.json({ username_taken: true });
      } if (user2) {
        return res.json({ email_taken: true });
      }
      const newUser:IUser = new User({
        username: req.body.user.username,
        email: req.body.user.email,
        password: req.body.user.password,
      });

      await newUser.save();

      const sessionUser = sessionizeUser(newUser);
      return res.json({ redirect: true, sessionUser });
    } catch (err) {
      return err;
    }
  },
};

export default UserController;
