"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsiderData = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const InsiderDataSchema = new mongoose_1.default.Schema({
    event_name: { type: String, required: true, unique: true },
    event_metadata: { type: Object, required: true },
    created_at: { type: Date, required: true },
    items: { type: Object },
});
exports.InsiderData = mongoose_1.default.model('InsiderData', InsiderDataSchema, 'insider_data');
