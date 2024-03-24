"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentMethod = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const PaymentMethodSchema = new mongoose_1.default.Schema({
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
exports.PaymentMethod = mongoose_1.default.model('PaymentMethod', PaymentMethodSchema, 'payment_method');
