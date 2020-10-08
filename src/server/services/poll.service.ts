import Poll, { IPoll } from '../models/poll.model';

const PollService = {
  async getAll():Promise<Array<{
    _id:string,
    name:string,
    votes:number,
    createdBy:string,
    updatedAt:Date,
    id:string,
  }>> {
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
      throw new Error(err.message);
    }
  },
  async get(id:string):Promise<{
    _id:string,
    name:string,
    question:string,
    votes:number,
    options:{},
    createdBy:string,
    updatedAt:Date,
    createdAt:Date,
  }> {
    try {
      const poll = await Poll.findById(id);
      return poll;
    } catch (err) {
      throw new Error(err.message);
    }
  },
  async getUsers(username:string):Promise<Array<{
    name:string, 
    votes: number, 
    id:string,
  }>> {
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
      throw new Error(err.message);
    }
  },
  async insert(name:string, question:string, options:{}, createdBy:string):Promise<string> {
    try {
      const newPoll:IPoll = new Poll({
        name,
        question,
        votes: 0,
        options,
        createdBy,
      });
      await newPoll.save();
      return newPoll._id;
    } catch (err) {
      throw new Error(err.message);
    }
  },
  async delete(id:string):Promise<void> {
    try {
      await Poll.findByIdAndDelete(id);
      return;
    } catch (err) {
      throw new Error(err.message);
    }
  },
  async deleteMany(username:string):Promise<void> {
    try {
      await Poll.deleteMany({ createdBy: username });
      return;
    } catch (err) {
      throw new Error(err.message);
    }
  },
  async update(id:string, updatedOptions:{}, votes:number):Promise<{
    _id:string,
    name:string,
    question:string,
    votes:number,
    options:{},
    createdBy:string,
    updatedAt:Date,
    createdAt:Date,
  }> {
    try {
      const poll = await Poll.findByIdAndUpdate(id,
        { votes: votes + 1, options: updatedOptions, updatedAt: new Date(Date.now()) }, { new: true });
      return poll;
    } catch (err) {
      throw new Error(err.message);
    }
  },
  async getStarred(listOfIds:[string]):Promise<Array<{
    _id:string,
    name:string,
    question:string,
    votes:number,
    options:{},
    createdBy:string,
    updatedAt:Date,
    createdAt:Date,
  }>> {
    try {
      const polls = await Poll.find({ _id: { $in: listOfIds } });
      return polls;
    } catch (err) {
      throw new Error(err.message);
    }
  },
};

export default PollService;
