import * as express from 'express';
import { Request, Response, NextFunction } from 'express';
import apiLimiter from '../apiLimiter';
import UserController from '../controllers/user.controller';

const router = express.Router();

const catchErr = (f:Function) => (req:Request, res:Response, next:NextFunction) => f(req, res)
  .catch((err:Error) => next(err));

router.route('/profile/:username').get(catchErr(UserController.getUser));
router.route('/profile').delete(catchErr(UserController.deleteUser));
router.route('/profile').put(catchErr(UserController.updateUser));
router.route('/star-poll').put(catchErr(UserController.addUserStarredPoll));
router.route('/unstar-poll').put(catchErr(UserController.removeUserStarredPoll));
router.route('/logout').get(catchErr(UserController.logout));
router.route('/login').get(UserController.checkIfLoggedIn);
router.route('/login').post(apiLimiter, UserController.authenticate);
router.route('/register').post(apiLimiter, catchErr(UserController.register));

export default router;
