import express from 'express';
import { Request, Response, NextFunction } from 'express';
import apiLimiter from '../apiLimiter';
import { validationRules, validate } from '../validator';
import authorize from '../authorize';
import UserController from '../controllers/user.controller';

const router = express.Router();

const catchErr = (f: (req: Request, res: Response) => Promise<unknown>) => (
  req: Request,
  res: Response,
  next: NextFunction,
) => f(req, res).catch((err: Error) => next(err));

router
  .route('/profile/:username')
  .get(authorize, catchErr(UserController.getUser));
router
  .route('/profile')
  .delete(authorize, catchErr(UserController.deleteUser));
router
  .route('/profile')
  .put(
    authorize,
    validationRules.userUpdate,
    validate,
    catchErr(UserController.updateUser),
  );
router
  .route('/star-poll')
  .put(authorize, catchErr(UserController.addUserStarredPoll));
router
  .route('/unstar-poll')
  .put(authorize, catchErr(UserController.removeUserStarredPoll));
router.route('/logout').get(catchErr(UserController.logout));
router.route('/login').get(UserController.checkIfLoggedIn);
router
  .route('/login')
  .post(
    apiLimiter,
    validationRules.userLogin,
    validate,
    UserController.authenticate,
  );
router
  .route('/register')
  .post(
    apiLimiter,
    validationRules.userRegistration,
    validate,
    catchErr(UserController.register),
  );

export default router;
