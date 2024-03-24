"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Url = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const UrlSchema = new mongoose_1.default.Schema({
    url: { type: String, required: true, unique: true },
    priority: { type: Number, required: true, default: 0 },
});
exports.Url = mongoose_1.default.model('Url', UrlSchema, 'urls');
