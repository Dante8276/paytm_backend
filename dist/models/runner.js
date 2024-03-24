"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Runner = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const RunnerSchema = new mongoose_1.default.Schema({
    email: { type: String, required: true },
    name: { type: String, required: true },
    ip: { type: String, required: true, unique: true },
    is_active: { type: Boolean, default: true },
});
exports.Runner = mongoose_1.default.model('Runner', RunnerSchema, 'runner');
