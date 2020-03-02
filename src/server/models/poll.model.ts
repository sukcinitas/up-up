import { Schema, model, Model, Document } from 'mongoose';

// const mongoose = require('mongoose');

const pollSchema:Schema = new Schema({
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
export interface IPoll extends Document {
  name:string,
  question:string,
  options:{},
  votes:number,
  createBy:string,
  createdAt?:string,
  updatedAt?:string,
};
export interface IPollModel extends Model<IPoll> {};

const Poll = model<IPoll>('Poll', pollSchema);

export default Poll;
// module.exports = Poll;
