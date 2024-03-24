import mongoose, { Document } from 'mongoose';

export interface IEmail extends Document {
  email: string;
  domain: string;
}

const EmailSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  domain: { type: String, required: true, ref: 'Domain' },
});

export const Email = mongoose.model<IEmail>('Email', EmailSchema, 'email');