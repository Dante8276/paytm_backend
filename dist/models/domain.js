"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Domain = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const DomainSchema = new mongoose_1.default.Schema({
    domain: { type: String, required: true, unique: true },
    priority: { type: Number, required: true },
    count: { type: Number, default: 0 },
});
exports.Domain = mongoose_1.default.model('Domain', DomainSchema, 'domains');
