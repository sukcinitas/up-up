import Poll, { IPoll } from '../models/poll.model';

const PollService = {
  async getAll() {
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
            createdAt: 1,
          },
        },
        {
          $sort: { createdAt: 1 },
        },
      ]);
      return polls;
    } catch (err) {
      return err;
    }
  },
  async get(id) {
    try {
      const poll = await Poll.findById(id);
      return poll;
    } catch (err) {
      return err;
    }
  },
  async getUsers(username) {
    try {
      const polls = await Poll.aggregate([
        { $match: { createdBy: username } },
        {
          $project: {
            id: '$_id',
            name: 1,
            votes: 1,
            _id: 0,
          },
        },
      ]);
      return polls;
    } catch (err) {
      return err;
    }
  },
  async insert(name, question, options, createdBy) {
    try {
      const newPoll:IPoll = new Poll({
        name,
        question,
        votes: 0,
        options,
        createdBy,
      });
      await newPoll.save();
      // eslint-disable-next-line no-underscore-dangle
      return newPoll._id;
    } catch (err) {
      return err;
    }
  },
  async delete(id) {
    try {
      await Poll.findByIdAndDelete(id);
      return 'The poll has been successfully deleted!';
    } catch (err) {
      return err;
    }
  },
  async update(id, updatedOptions, votes) {
    try {
      const poll = await Poll.findByIdAndUpdate(id,
        { votes: votes + 1, options: updatedOptions, updatedAt: Date.now() }, { new: true });
      return poll;
    } catch (err) {
      return err;
    }
  },
};

export default PollService;
