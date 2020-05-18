import {
  Schema, model, Document, Model,
} from 'mongoose';
import { hashSync } from 'bcryptjs';

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
},
{ timestamps: true });

export interface IUser extends Document{
  username:string,
  email:string,
  password:string,
  createdAt?:Date,
  updatedAt?:Date,
}
// better not use arrow functions, because it would need binding
userSchema.pre<IUser>('save', function hashPassword() {
  if (this.isModified('password')) {
    this.password = hashSync(this.password, 10);
  }
});
export interface IUserModel extends Model<IUser> {}
const User = model<IUser>('User', userSchema);

export default User;
