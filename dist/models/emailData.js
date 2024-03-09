"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailData = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const EmailDataSchema = new mongoose_1.default.Schema({
    id: { type: Date, required: true },
    from_mail: { type: String, required: true },
    to_mail: { type: String, required: true },
    date: { type: String, required: true },
    email_data: { type: String, required: true },
    otp: { type: String, required: true },
});
exports.EmailData = mongoose_1.default.model('EmailData', EmailDataSchema, 'email_data');
