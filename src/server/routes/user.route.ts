import * as express from 'express';
import apiLimiter from '../apiLimiter';
import UserController from '../controllers/user.controller';

const router = express.Router();

router.route('/profile/:username').get(UserController.getUser);
router.route('/profile').delete(UserController.deleteUser);
router.route('/profile').put(UserController.updateUser);
router.route('/star-poll').put(UserController.addUserStarredPoll);
router.route('/unstar-poll').put(UserController.removeUserStarredPoll);
router.route('/logout').get(UserController.logout);
router.route('/login').get(UserController.checkIfLoggedIn);
router.route('/login').post(apiLimiter, UserController.authenticate);
router.route('/register').post(apiLimiter, UserController.register);

export default router;
