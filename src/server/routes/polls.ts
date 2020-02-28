import { Request, Response } from 'express';
const router = require('express').Router();
const Poll = require('../models/poll.model');

// GET all polls, GET one poll by id, DELETE one poll by id, PUT vote in poll by id

router.route('/').get(async (req:Request, res:Response) => {
  try {
    const polls = await Poll.aggregate([
      { $match: {} },
      {
        $project: {
          id: '$_id',
          name: 1,
          votes: 1,
          createdBy: 1,
          updatedAt: 1,
        },
      },
    ]);
    res.json({ polls });
  } catch (err) {
    res.json(`Error: ${err}`);
  }
});

router.route('/:id').get(async (req:Request, res:Response) => {
  try {
    const poll = await Poll.findById(req.params.id);
    res.json({ poll });
  } catch (err) {
    res.json(`Error: ${err}`);
  }
});

router.route('/:id').delete(async (req:Request, res:Response) => {
  try {
    await Poll.findByIdAndDelete(req.params.id);
    res.send('The poll has been successfully deleted!');
  } catch (err) {
    res.json(`Error: ${err}`);
  }
});

router.route('/:id').put(async (req:Request, res:Response) => {
  try {
    const { option, options, votes } = req.body;
    const updatedOptions = { ...options };
    updatedOptions[option] = options[option] + 1;

    const poll = await Poll.findByIdAndUpdate(req.params.id,
      { votes: votes + 1, options: updatedOptions, updatedAt: Date.now() }, { new: true });
    res.json({ poll });
  } catch (err) {
    res.json(`Error: ${err}`);
  }
});

module.exports = router;
