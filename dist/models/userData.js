"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserData = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const UserDataSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true, unique: true },
    address_line_1: { type: String, required: true },
    address_line_2: { type: String, required: true },
    landmark: { type: String },
    n_times_used: { type: Number, required: true },
    pincode: { type: String, required: true },
    phone_number: { type: String, required: true },
    country_code: { type: String, required: true },
    is_delivery: { type: Boolean, required: true }
});
exports.UserData = mongoose_1.default.model('UserData', UserDataSchema, 'user_data');
