import mongoose from 'mongoose';

export interface ITransaction {
  payment_method_id: mongoose.Types.ObjectId;
  runner_id: mongoose.Types.ObjectId;
  amount: number;
  date: Date;
}

export interface ITransactionDocument extends ITransaction, mongoose.Document {}

const TransactionSchema = new mongoose.Schema({
  payment_method_id: { type: mongoose.Schema.Types.ObjectId, ref: 'PaymentMethod', required: true },
  runner_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Runner', required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
});

export const Transaction = mongoose.model<ITransactionDocument>('Transaction', TransactionSchema, 'transactions');