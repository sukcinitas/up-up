import express from 'express';
import { Request, Response, NextFunction } from 'express';
import PollController from '../controllers/poll.controller';
import { validationRules, validate } from '../validator';
import authorize from '../authorize';

const router = express.Router();

const catchErr = (f: (req: Request, res: Response) => Promise<unknown>) => (
  req: Request,
  res: Response,
  next: NextFunction,
) => f(req, res).catch((err: Error) => next(err));

router.route('/').get(catchErr(PollController.getAll));
router
  .route('/:id')
  .get(catchErr(PollController.get))
  .delete(authorize, catchErr(PollController.delete))
  .put(catchErr(PollController.update));
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
router
  .route('/starred')
  .post(authorize, catchErr(PollController.getStarred));

export default router;
