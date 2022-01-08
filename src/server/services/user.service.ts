import User, { IUser } from '../models/user.model';

const UserService = {
  async getUserByUsername(
    username: string,
  ): Promise<
    Array<{
      _id?: string;
      username: string;
      email: string;
      starredPolls: Array<string>;
    }>
  > {
    const user = await User.find(
      { username },
      '-password -createdAt -updatedAt -v',
    ).exec();
    return user;
  },
  async getOneUserByUsername(username: string): Promise<IUser> {
    const user = await User.findOne({ username }).exec();
    return user;
  },
  async getOneUserById(id: string): Promise<IUser> {
    const user = await User.findOne({ _id: id }).exec();
    return user;
  },
  async getOneUserByEmail(
    email: string,
  ): Promise<{
    _id?: string;
    username: string;
    email: string;
    starredPolls: Array<string>;
    createdAt: Date;
    updatedAt: Date;
  }> {
    const user = await User.findOne({ email }, '-password').exec();
    return user;
  },

  async deleteUser(id: string): Promise<void> {
    await User.deleteOne({ _id: id }).exec();
  },

  async updateUserEmail(id: string, email: string): Promise<void> {
    await User.findByIdAndUpdate({ _id: id }, { email }).exec();
  },

  async addUserStarredPoll(
    id: string,
    pollId: string,
  ): Promise<void> {
    await User.findByIdAndUpdate(
      { _id: id },
      { $push: { starredPolls: pollId } },
    ).exec();
  },

  async removeUserStarredPoll(
    id: string,
    pollId: string,
  ): Promise<void> {
    await User.findByIdAndUpdate(
      { _id: id },
      { $pull: { starredPolls: pollId } },
    ).exec();
  },
};

export default UserService;
