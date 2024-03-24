"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Email = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const EmailSchema = new mongoose_1.default.Schema({
    email: { type: String, required: true, unique: true },
    domain: { type: String, required: true, ref: 'Domain' },
});
exports.Email = mongoose_1.default.model('Email', EmailSchema, 'email');
