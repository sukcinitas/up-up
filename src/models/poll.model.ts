import { Schema, model, Model, Document } from 'mongoose';
import UserService from '../services/user.service';

const pollSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    options: Array,
    votes: Number,
    createdBy: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export interface IPoll extends Document {
  name: string;
  question?: string;
  options?: Array<{ option: string; votes: number }>;
  votes: number;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
pollSchema.pre<IPoll>('save', async function checkIfUserExists() {
  try {
    const user = await UserService.getOneUserByUsername(
      this.createdBy,
    );
    if (!user)
      throw Error('Could not create poll; user does not exist!');
  } catch (err: unknown) {
    throw Error(
      err instanceof Error
        ? err.message
        : 'An error occured while checking if user exists!',
    );
  }
});
export interface IPollModel extends Model<IPoll> {}

const Poll = model<IPoll>('Poll', pollSchema);

export default Poll;
