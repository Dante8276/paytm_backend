import mongoose, { Document } from 'mongoose';

export interface IScript extends Document {
  page: string;
  matcher: string;
  handler: string;
  handler_params: string[];
  hash: string;
}

const ScriptSchema = new mongoose.Schema({
  page: { type: String, required: true },
  matcher: { type: String, required: true },
  handler: { type: String, required: true },
  handler_params: { type: [String], required: true },
  hash: { type: String, required: true, unique: true },
});

export const Script = mongoose.model<IScript>('Script', ScriptSchema, 'scripts');