// import * as mongoose from 'mongoose';
// import { hashSync } from 'bcryptjs';

const mongoose = require('mongoose');
const { hashSync } = require('bcryptjs');

const userSchema = new mongoose.Schema({
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


// better not use arrow functions, because it would need binding
userSchema.pre('save', function hashPassword() {
  if (this.isModified('password')) {
    this.password = hashSync(this.password, 10);
  }
});

const User = mongoose.model('User', userSchema);

// export default User;
module.exports = User;
