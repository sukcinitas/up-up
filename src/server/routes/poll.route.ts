import PollController from '../controllers/poll.controller';

const router = require('express').Router();

router.route('/').get(PollController.getAll);
router.route('/:id').get(PollController.get);
router.route('/user/:username').get(PollController.getUsers);
router.route('/:id').delete(PollController.delete);
router.route('/:id').put(PollController.update);
router.route('/create-poll').post(PollController.insert);

module.exports = router;
