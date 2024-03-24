import mongoose, { Document } from 'mongoose';

export interface IUrl extends Document {
  url: string;
  priority: number;
}

const UrlSchema = new mongoose.Schema({
  url: { type: String, required: true, unique: true },
  priority: { type: Number, required: true, default: 0 },
});

export const Url = mongoose.model<IUrl>('Url', UrlSchema, 'urls');