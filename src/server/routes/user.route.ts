import UserController from '../controllers/user.controller';

const router = require('express').Router();

router.route('/profile/:username').get(UserController.getUser);
router.route('/profile').delete(UserController.deleteUser);
router.route('/profile').put(UserController.updateUser);
router.route('/logout').get(UserController.logout);
router.route('/login').get(UserController.checkIfLoggedIn);
router.route('/login').post(UserController.authenticate);
router.route('/register').post(UserController.register);

module.exports = router;
