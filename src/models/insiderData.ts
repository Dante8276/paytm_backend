import mongoose, { Document } from 'mongoose';

export interface IInsiderData {
  event_name: string;
  event_metadata: any;
  created_at: Date;
  items?: { [key: string]: any };
}

export interface IInsiderDataDocument extends IInsiderData, Document {}

const InsiderDataSchema = new mongoose.Schema({
  event_name: { type: String, required: true, unique: true },
  event_metadata: { type: Object, required: true },
  created_at: { type: Date, required: true },
  items: { type: Object },
});

export const InsiderData = mongoose.model<IInsiderDataDocument>('InsiderData', InsiderDataSchema, 'insider_data');