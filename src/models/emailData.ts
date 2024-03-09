import mongoose, { Document } from 'mongoose';

export interface IEmailData extends Document {
  id: Date;
  from_mail: string;
  to_mail: string;
  date: string;
  email_data: string;
  otp: string;
}

const EmailDataSchema = new mongoose.Schema({
  id: { type: Date, required: true },
  from_mail: { type: String, required: true },
  to_mail: { type: String, required: true },
  date: { type: String, required: true },
  email_data: { type: String, required: true },
  otp: { type: String, required: true },
});

export const EmailData = mongoose.model<IEmailData>('EmailData', EmailDataSchema, 'email_data');