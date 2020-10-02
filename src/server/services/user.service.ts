import User from '../models/user.model';

const UserService = {
  async getUserByUsername(username) {
    try {
      const user = await User.find({ username }, '-password -createdAt -updatedAt -v');
      return user;
    } catch (err) {
      return err;
    }
  },
  async getOneUserByUsername(username) {
    try {
      const user = await User.findOne({ username });
      return user;
    } catch (err) {
      return err;
    }
  },
  async getOneUserById(id) {
    try {
      const user = await User.findOne({ _id: id });
      return user;
    } catch (err) {
      return err;
    }
  },
  async getOneUserByEmail(email) {
    try {
      const user = await User.findOne({ email });
      return user;
    } catch (err) {
      return err;
    }
  },
  async deleteUser(id) {
    try {
      await User.findByIdAndDelete(id);
      return 'User has been successfully deleted!';
    } catch (err) {
      return err;
    }
  },
  async updateUserEmail(id, email) {
    try {
      await User.findByIdAndUpdate({ _id: id }, { email });
      return 'User has been successfully updated!';
    } catch (err) {
      return err;
    }
  },
  async addUserStarredPoll(id, pollId) {
    try {
      await User.findByIdAndUpdate({ _id: id }, { $push: { starredPolls: pollId } });
      return 'User has been successfully updated!';
    } catch (err) {
      return err;
    }
  },
  async removeUserStarredPoll(id, pollId) {
    try {
      await User.findByIdAndUpdate({ _id: id }, { $pull: { starredPolls: pollId } });
      return 'User has been successfully updated!';
    } catch (err) {
      return err;
    }
  },
};

export default UserService;
