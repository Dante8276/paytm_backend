"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RunnerUrl = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const RunnerUrlSchema = new mongoose_1.default.Schema({
    runner_id: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Runner', required: true },
    url_id: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Url', required: true },
    ip: { type: String, required: true },
});
RunnerUrlSchema.index({ runner_id: 1, url_id: 1 }, { unique: true });
exports.RunnerUrl = mongoose_1.default.model('RunnerUrl', RunnerUrlSchema, 'runner_url');
