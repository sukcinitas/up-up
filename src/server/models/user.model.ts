import { Schema, model, Document, Model } from 'mongoose';
import PollService from '../services/poll.service';
import UserService from '../services/user.service';
import { hashPassword } from '../passwordHashing';

const userSchema: Schema = new Schema(
  {
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
  { timestamps: true },
);

export interface IUser extends Document {
  _id?: string;
  username: string;
  email: string;
  password: string;
  starredPolls: Array<string>;
  createdAt: Date;
  updatedAt: Date;
}

userSchema.pre<IUser>('save', function hash() {
  if (this.isModified('password')) {
    this.password = hashPassword(this.password);
  }
});
userSchema.pre<IUser>('deleteOne', async function deleteUserPolls() {
  try {
    // @ts-ignore
    const id = this.getQuery()._id;
    const user = await UserService.getOneUserById(id);
    await PollService.deleteMany(user.username);
  } catch (err: unknown) {
    throw Error('Something went wrong!');
  }
});
export interface IUserModel extends Model<IUser> {}
const User = model<IUser>('User', userSchema);

export default User;
