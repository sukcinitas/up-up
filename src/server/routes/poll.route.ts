import * as express from 'express';
import PollController from '../controllers/poll.controller';

const router = express.Router();

router.route('/').get(PollController.getAll);
router.route('/:id').get(PollController.get);
router.route('/:id').delete(PollController.delete);
router.route('/:id').put(PollController.update);
router.route('/user/:username').get(PollController.getUsers);
router.route('/create-poll').post(PollController.insert);
router.route('/starred').post(PollController.getStarred);

export default router;
