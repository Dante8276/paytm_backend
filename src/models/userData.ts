import mongoose, { Document } from 'mongoose';

export interface IUserData extends Document {
  name: string;
  address_line_1: string;
  address_line_2: string;
  landmark?: string;
  n_times_used: number;
}

const UserDataSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address_line_1: { type: String, required: true },
  address_line_2: { type: String, required: true },
  landmark: { type: String },
  n_times_used: { type: Number, required: true },
});

export const UserData = mongoose.model<IUserData>('UserData', UserDataSchema, 'user_data');