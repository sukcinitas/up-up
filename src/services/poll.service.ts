import Poll, { IPoll } from '../models/poll.model';

const PollService = {
  async getAll(): Promise<
    Array<{
      _id: string;
      name: string;
      votes: number;
      createdBy: string;
      updatedAt: Date;
      id: string;
    }>
  > {
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
  },

  async get(id: string): Promise<IPoll> {
    const poll = await Poll.findById(id).exec();
    return poll;
  },

  async getUsers(
    username: string,
  ): Promise<
    Array<{
      name: string;
      votes: number;
      id: string;
    }>
  > {
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
  },

  async insert(
    name: string,
    question: string,
    options: Array<{ option: string; votes: number }>,
    createdBy: string,
  ): Promise<string> {
    const newPoll: IPoll = new Poll({
      name,
      question,
      votes: 0,
      options,
      createdBy,
    });
    await newPoll.save();
    return newPoll.id;
  },

  async delete(id: string): Promise<void> {
    await Poll.findByIdAndDelete(id).exec();
  },

  async deleteMany(username: string): Promise<void> {
    await Poll.deleteMany({ createdBy: username }).exec();
  },

  async update(
    id: string,
    updatedOptions: Array<{ option: string; votes: number }>,
    votes: number,
  ): Promise<IPoll> {
    const poll = await Poll.findByIdAndUpdate(
      id,
      {
        votes: votes + 1,
        options: updatedOptions,
        updatedAt: new Date(Date.now()),
      },
      { new: true },
    ).exec();
    return poll;
  },

  async getStarred(listOfIds: Array<string>): Promise<Array<IPoll>> {
    const polls = await Poll.find(
      { _id: { $in: listOfIds } },
      '-createdAt -updatedAt -v -question -options -createdBy',
    ).exec();
    return polls;
  },
};

export default PollService;
