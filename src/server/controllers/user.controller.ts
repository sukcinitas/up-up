import { Request, Response, NextFunction } from 'express';
import * as passport from 'passport';
import User, { IUser } from '../models/user.model';
import UserService from '../services/user.service';
import { comparePassword } from '../passwordHashing';
import '../passport.config';

const sessionizeUser = (user: {
  id?: string;
  username?: string;
  email?: string;
  paassword?: string;
  starredPolls?: Array<{}>;
}): { userId: string; username: string } => ({
  userId: user.id,
  username: user.username,
});

const UserController = {
  async getUser(req: Request, res: Response) {
    try {
      const { username } = req.params;
      const user = await UserService.getUserByUsername(username);
      return res.json({ success: true, user });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: 'User retrieval failed!',
        error: err.message,
      });
    }
  },
  async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.body;
      await UserService.deleteUser(id);
      req.logout();
      return res.json({
        success: true,
        message: 'User has been successfully deleted!',
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: 'User deletion failed!',
        error: err.message,
      });
    }
  },
  // eslint-disable-next-line consistent-return
  async updateUser(req: Request, res: Response) {
    try {
      const { parameter } = req.body;
      if (parameter === 'email') {
        const { email, id, password } = req.body;
        const userEmail = await UserService.getOneUserByEmail(email);
        if (userEmail) {
          return res.json({
            success: false,
            message: 'This e-mail is already in use! Try again!',
          });
        }
        const user = await UserService.getOneUserById(id);
        if (user && !comparePassword(password, user.password)) {
          return res.json({
            success: false,
            message: 'Password is incorrect! Try again!',
          });
        }
        await UserService.updateUserEmail(id, email);
        return res.json({
          success: true,
          message: 'Your email has been successfully updated!',
        });
      }
      if (parameter === 'password') {
        const { username, oldpassword, newpassword } = req.body;
        const user = await UserService.getOneUserByUsername(username);
        if (user && comparePassword(oldpassword, user.password)) {
          user.password = newpassword;
          await user.save(); // to hash password in pre-save
          return res.json({
            success: true,
            message: 'Your password has been successfully updated!',
          });
        }
        return res
          .status(500)
          .json({
            success: false,
            message: 'Password is incorrect!',
          });
      }
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: 'User update failed!',
        error: err.message,
      });
    }
  },
  async logout(req: Request, res: Response) {
    try {
      await req.logout();
      return res.json({
        success: true,
        message: 'User has successfully loged out!',
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: 'Logout failed!',
        error: err.message,
      });
    }
  },
  checkIfLoggedIn(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.json({
          success: false,
          user: sessionizeUser({ id: '', username: '' }),
        });
      }
      return res.json({
        success: true,
        user: sessionizeUser(req.user),
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: 'Could not check if user is logged in!',
        error: err.message,
      });
    }
  },
  authenticate(req: Request, res: Response, next: NextFunction) {
    try {
      // eslint-disable-next-line consistent-return
      return passport.authenticate(
        'local',
        { session: true },
        (err, user) => {
          if (err) {
            return next(err);
          }
          if (!user) {
            return res.json({
              success: false,
              message: 'Username or password is incorrect!',
            });
          }
          req.login(user, (loginErr) => {
            if (loginErr) {
              return next(loginErr);
            }
            return res.json({
              success: true,
              sessionUser: sessionizeUser(user),
            });
          });
        },
      )(req, res, next);
    } catch (err) {
      return res
        .status(500)
        .json({
          success: false,
          message: 'User could not be authenticated!',
        });
    }
  },
  async register(req: Request, res: Response) {
    try {
      const { username, email } = req.body;
      const user = await UserService.getOneUserByUsername(username);
      const user2 = await UserService.getOneUserByEmail(email);
      if (user && user2) {
        return res.json({
          success: false,
          message:
            'Username and email are both already in use! Try again!',
          username_taken: true,
          email_taken: true,
        });
      }
      if (user) {
        return res.json({
          success: false,
          username_taken: true,
          message: 'Username is already in use!',
        });
      }
      if (user2) {
        return res.json({
          success: false,
          email_taken: true,
          message: 'Email is already in use!',
        });
      }
      const newUser: IUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        starredPolls: [],
      });

      await newUser.save();

      const sessionUser = sessionizeUser(newUser);
      return res.json({ success: true, sessionUser });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: 'User could not be registered!',
        error: err.message,
      });
    }
  },
  async addUserStarredPoll(req: Request, res: Response) {
    try {
      const { id, pollId } = req.body;
      await UserService.addUserStarredPoll(id, pollId);
      return res.json({
        success: true,
        message: 'Poll has been successfully saved!',
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: 'Could not save the poll!',
        error: err.message,
      });
    }
  },
  async removeUserStarredPoll(req: Request, res: Response) {
    try {
      const { id, pollId } = req.body;
      await UserService.removeUserStarredPoll(id, pollId);
      return res.json({
        success: true,
        message: 'Poll has been successfully removed!',
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: 'Could not remove the poll from the saved list!',
        error: err.message,
      });
    }
  },
};

export default UserController;
