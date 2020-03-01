// import * as mongoose from 'mongoose';

const mongoose = require('mongoose');

const pollSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  options: {},
  votes: Number,
  createdBy: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});
// not sure about timestamps
// export interface IPollSchema extends mongoose.Document {
//   name:string,
//   question:string,
//   options:{},
//   votes:number,
//   createBy:string,
// };
// export interface IPollModel extends model<IPollSchema>;

const Poll = mongoose.model('Poll', pollSchema);

// export default Poll;
module.exports = Poll;
