import { Request, Response } from 'express';
import PollService from '../services/poll.service';

const PollController = {
  async getAll(req: Request, res: Response) {
    try {
      const polls = await PollService.getAll();
      return res.json({ success: true, polls });
    } catch (err: unknown) {
      return res.status(500).json({
        success: false,
        message: 'Could not retrieve polls!',
        error: err instanceof Error ? err.message : '',
      });
    }
  },
  async get(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const poll = await PollService.get(id);
      return res.json({ success: true, poll });
    } catch (err: unknown) {
      return res.status(500).json({
        success: false,
        message: 'Could not retrieve poll information!',
        error: err instanceof Error ? err.message : '',
      });
    }
  },
  async getUsers(req: Request, res: Response) {
    try {
      const { username } = req.params;
      const polls = await PollService.getUsers(username);
      return res.json({ success: true, polls });
    } catch (err: unknown) {
      return res.status(500).json({
        success: false,
        message: 'Could not retrieve polls!',
        error: err instanceof Error ? err.message : '',
      });
    }
  },
  async insert(req: Request, res: Response) {
    try {
      const { name, question, options, createdBy } = req.body;
      const id = await PollService.insert(
        name,
        question,
        options,
        createdBy,
      );
      return res.json({ success: true, id });
    } catch (err: unknown) {
      return res.status(500).json({
        success: false,
        message: 'Could not create a poll!',
        error: err instanceof Error ? err.message : '',
      });
    }
  },
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await PollService.delete(id);
      return res.json({
        success: true,
        message: 'The poll has been successfully deleted!',
      });
    } catch (err: unknown) {
      return res.status(500).json({
        success: false,
        message: 'Could not delete the poll!',
        error: err instanceof Error ? err.message : '',
      });
    }
  },
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { option, options, votes } = req.body;
      const updatedOptions = [...options];
      const optionToBeChangedId = options.findIndex(
        (elem: { option: string; votes: number }) =>
          elem.option === option.option,
      );
      updatedOptions[optionToBeChangedId].votes += 1;
      const poll = await PollService.update(
        id,
        updatedOptions,
        votes,
      );
      return res.json({ success: true, poll });
    } catch (err: unknown) {
      return res.status(500).json({
        success: false,
        message: 'Poll could not be updated!',
        error: err instanceof Error ? err.message : '',
      });
    }
  },
  async getStarred(req: Request, res: Response) {
    try {
      const { listOfIds } = req.body;
      const polls = await PollService.getStarred(listOfIds);
      return res.json({ success: true, polls });
    } catch (err: unknown) {
      return res.status(500).json({
        success: false,
        message: 'Could not retrieve polls!',
        error: err instanceof Error ? err.message : '',
      });
    }
  },
};

export default PollController;
