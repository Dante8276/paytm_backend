import mongoose, { Document } from 'mongoose';

export interface IPaymentMethod extends Document {
  method_type: string;
  max_transactions_count: number;
  single_transaction_limit: number;
  total_amount_limit: number;
  is_available: boolean;
  method_info_column_1: string;
  method_info_column_2?: string;
  method_info_column_3?: string;
  name: string;
  priority: number;
}

const PaymentMethodSchema = new mongoose.Schema({
  method_type: { type: String, required: true },
  max_transactions_count: { type: Number, required: true },
  single_transaction_limit: { type: Number, required: true },
  total_amount_limit: { type: Number, required: true },
  is_available: { type: Boolean, required: true },
  method_info_column_1: { type: String, required: true },
  method_info_column_2: { type: String },
  method_info_column_3: { type: String },
  name: { type: String, required: true, unique: true },
  priority: { type: Number, required: true },
});

export const PaymentMethod = mongoose.model<IPaymentMethod>('PaymentMethod', PaymentMethodSchema, 'payment_method');