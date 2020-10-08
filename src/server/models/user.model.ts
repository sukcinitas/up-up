/* eslint-disable no-underscore-dangle */
import {
  Schema, model, Document, Model,
} from 'mongoose';
import PollService from '../services/poll.service';
import UserService from '../services/user.service';
import { hashPassword } from '../passwordHashing';

const userSchema:Schema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 5,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  starredPolls: {
    type: Array,
  },
},
{ timestamps: true });

export interface IUser extends Document{
  username:string,
  email:string,
  password:string,
  starredPolls:Array<string>
  createdAt:Date,
  updatedAt:Date,
  getQuery:any,
}

userSchema.pre<IUser>('save', function hash() {
  if (this.isModified('password')) {
    this.password = hashPassword(this.password);
  }
});
userSchema.pre<IUser>('findOneAndDelete', async function deleteUserPolls() {
  try {
    const user = await UserService.getOneUserById(this.getQuery()._id);
    await PollService.deleteMany(user.username);
  } catch (err) {
    throw Error(err.message);
  }
});
export interface IUserModel extends Model<IUser> {}
const User = model<IUser>('User', userSchema);

export default User;
