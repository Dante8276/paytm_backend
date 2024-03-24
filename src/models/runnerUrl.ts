import mongoose, { Document } from 'mongoose';

export interface IRunnerUrl extends Document {
  runner_id: mongoose.Types.ObjectId;
  url_id: mongoose.Types.ObjectId;
  ip: string;
}

const RunnerUrlSchema = new mongoose.Schema({
  runner_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Runner', required: true },
  url_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Url', required: true },
  ip: { type: String, required: true },
});

RunnerUrlSchema.index({ runner_id: 1, url_id: 1 }, { unique: true });

export const RunnerUrl = mongoose.model<IRunnerUrl>('RunnerUrl', RunnerUrlSchema, 'runner_url');