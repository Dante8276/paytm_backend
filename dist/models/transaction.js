"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const TransactionSchema = new mongoose_1.default.Schema({
    payment_method_id: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'PaymentMethod', required: true },
    runner_id: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Runner', required: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
});
exports.Transaction = mongoose_1.default.model('Transaction', TransactionSchema, 'transactions');
