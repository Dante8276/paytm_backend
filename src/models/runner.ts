import mongoose, { Document } from 'mongoose';

export interface IRunner extends Document {
  email: string;
  name: string;
  ip: string;
  is_active: boolean;
}

const RunnerSchema = new mongoose.Schema({
  email: { type: String, required: true },
  name: { type: String, required: true },
  ip: { type: String, required: true, unique: true },
  is_active: { type: Boolean, default: true },
});

export const Runner = mongoose.model<IRunner>('Runner', RunnerSchema, 'runner');