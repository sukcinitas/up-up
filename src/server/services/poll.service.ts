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
          },
        },
        {
          $sort: { updatedAt: -1 },
        },
      ]);
      return polls;
    } catch (err) {
      throw Error(err.message);
    }
  },
  async get(id) {
    try {
      const poll = await Poll.findById(id);
      return poll;
    } catch (err) {
      throw Error(err.message);
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
      throw Error(err.message);
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
      throw Error(err.message);
    }
  },
  async delete(id) {
    try {
      await Poll.findByIdAndDelete(id);
      return;
    } catch (err) {
      throw Error(err.message);
    }
  },
  async deleteMany(username) {
    try {
      await Poll.deleteMany({ createdBy: username });
      return;
    } catch (err) {
      throw Error(err.message);
    }
  },
  async update(id, updatedOptions, votes) {
    try {
      const poll = await Poll.findByIdAndUpdate(id,
        { votes: votes + 1, options: updatedOptions, updatedAt: Date.now() }, { new: true });
      return poll;
    } catch (err) {
      throw Error(err.message);
    }
  },
  async getStarred(listOfIds) {
    try {
      const polls = await Poll.find({ _id: { $in: listOfIds } });
      return polls;
    } catch (err) {
      throw Error(err.message);
    }
  },
};

export default PollService;
