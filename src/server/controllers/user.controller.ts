import { Request, Response } from 'express';
import UserService from '../services/user.service';

const { compareSync } = require('bcryptjs');

const UserController = {
  async getUser(req:Request, res:Response) {
    const { username } = req.params;
    return res.json({ user: await UserService.getUser(username) });
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
      const user = await UserService.getUserByEmail(email);
      if (user.length !== 0) {
        return res.json({ message: 'This e-mail is already in use! Try again!' });
      }
      await UserService.updateUser(id, email);
      return res.json({ message: 'Your email has been successfully updated!' });
    } if (parameter === 'password') {
      const { username, oldpassword, newpassword } = req.body;
      const user = await UserService.getUserByUsername(username);
      if (user && compareSync(oldpassword, user.password)) {
        user.password = newpassword;
        await user.save(); // to hash password in pre-save
        return res.json({ message: 'Your password has been successfully updated!' });
      }
      return res.json({ message: 'Password is incorrect!' });
    }
  },
};

export default UserController;
