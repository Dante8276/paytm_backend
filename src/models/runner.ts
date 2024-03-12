import mongoose, { Document } from 'mongoose';

export interface IRunner extends Document {
  email: string;
  name: string;
}

const RunnerSchema = new mongoose.Schema({
  email: { type: String, required: true },
  name: { type: String, required: true },
});

RunnerSchema.index({ email: 1, name: 1 }, { unique: true });

export const Runner = mongoose.model<IRunner>('Runner', RunnerSchema, 'runner');