import * as express from 'express';
import { Request, Response, NextFunction } from 'express';
import PollController from '../controllers/poll.controller';
import { validationRules, validate } from '../validator';
import authorize from '../authorize';

const router = express.Router();

const catchErr = (f: Function) => (
  req: Request,
  res: Response,
  next: NextFunction,
) => f(req, res).catch((err: Error) => next(err));

router.route('/').get(catchErr(PollController.getAll));
router.route('/:id').get(catchErr(PollController.get));
router.route('/:id').delete(authorize, catchErr(PollController.delete));
router.route('/:id').put(catchErr(PollController.update));
router
  .route('/user/:username')
  .get(authorize, catchErr(PollController.getUsers));
router
  .route('/create-poll')
  .post(
    authorize,
    validationRules.poll,
    validate,
    catchErr(PollController.insert),
  );
router.route('/starred').post(authorize, catchErr(PollController.getStarred));

export default router;
