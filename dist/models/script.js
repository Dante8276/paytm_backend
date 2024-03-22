"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Script = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const ScriptSchema = new mongoose_1.default.Schema({
    page: { type: String, required: true },
    matcher: { type: String, required: true },
    handler: { type: String, required: true },
    handler_params: { type: [String], required: true },
    hash: { type: String, required: true, unique: true },
});
exports.Script = mongoose_1.default.model('Script', ScriptSchema, 'scripts');
