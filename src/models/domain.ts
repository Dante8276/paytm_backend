import mongoose, { Document } from 'mongoose';

export interface IDomain extends Document {
  domain: string;
  priority: number;
  count: number;
}

const DomainSchema = new mongoose.Schema({
  domain: { type: String, required: true, unique: true },
  priority: { type: Number, required: true },
  count: { type: Number, default: 0 },
});

export const Domain = mongoose.model<IDomain>('Domain', DomainSchema, 'domains');