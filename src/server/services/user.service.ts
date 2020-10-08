import User, { IUser } from '../models/user.model';

const UserService = {
  async getUserByUsername(username:string):Promise<Array<{
    _id:string,
    username:string,
    email:string,
    starredPolls:Array<string>
  }>> {
    try {
      const user = await User.find({ username }, '-password -createdAt -updatedAt -v');
      return user;
    } catch (err) {
      throw new Error(err.message);
    }
  },
  async getOneUserByUsername(username:string):Promise<IUser> {
    try {
      const user = await User.findOne({ username });
      return user;
    } catch (err) {
      throw new Error(err.message);
    }
  },
  async getOneUserById(id:string):Promise<IUser> {
    try {
      const user = await User.findOne({ _id: id });
      return user;
    } catch (err) {
      throw new Error(err.message);
    }
  },
  async getOneUserByEmail(email:string):Promise<{
    _id:string,
    username:string,
    email:string,
    starredPolls:Array<string>
    createdAt:Date,
    updatedAt:Date,
  }> {
    try {
      const user = await User.findOne({ email }, '-password');
      return user;
    } catch (err) {
      throw new Error(err.message);
    }
  },
  async deleteUser(id:string):Promise<string> {
    try {
      await User.findOneAndDelete({ _id: id });
      return 'User has been successfully deleted!';
    } catch (err) {
      throw new Error(err.message);
    }
  },
  async updateUserEmail(id:string, email:string):Promise<string> {
    try {
      await User.findByIdAndUpdate({ _id: id }, { email });
      return 'User has been successfully updated!';
    } catch (err) {
      throw new Error(err.message);
    }
  },
  async addUserStarredPoll(id:string, pollId:string):Promise<string> {
    try {
      await User.findByIdAndUpdate({ _id: id }, { $push: { starredPolls: pollId } });
      return 'User has been successfully updated!';
    } catch (err) {
      throw new Error(err.message);
    }
  },
  async removeUserStarredPoll(id:string, pollId:string):Promise<string> {
    try {
      await User.findByIdAndUpdate({ _id: id }, { $pull: { starredPolls: pollId } });
      return 'User has been successfully updated!';
    } catch (err) {
      throw new Error(err.message);
    }
  },
};

export default UserService;
