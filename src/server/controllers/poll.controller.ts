import { Request, Response } from 'express';
import PollService from '../services/poll.service';

const PollController = {
  async getAll(req:Request, res:Response) {
    return res.json({ polls: await PollService.getAll() });
  },
  async get(req:Request, res:Response) {
    const { id } = req.params;
    return res.json({ poll: await PollService.get(id) });
  },
  async getUsers(req:Request, res:Response) {
    const { username } = req.params;
    return res.json({ polls: await PollService.getUsers(username) });
  },
  async insert(req:Request, res:Response) {
    const {
      name, question, options, createdBy,
    } = req.body;
    return res.json(
      { redirect: true, id: await PollService.insert(name, question, options, createdBy) },
    );
  },
  async delete(req:Request, res:Response) {
    const { id } = req.params;
    return res.send(await PollService.delete(id));
  },
  async update(req:Request, res:Response) {
    const { id } = req.params;
    const { option, options, votes } = req.body;
    const updatedOptions = { ...options };
    updatedOptions[option] = options[option] + 1;
    return res.json({ poll: await PollService.update(id, updatedOptions, votes) });
  },
};

export default PollController;
