"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignUrlToRunner = void 0;
const runnerUrl_1 = require("../models/runnerUrl");
const url_1 = require("../models/url");
const assignUrlToRunner = (runnerId, runnerIp) => __awaiter(void 0, void 0, void 0, function* () {
    const existingRunnerUrl = yield runnerUrl_1.RunnerUrl.findOne({ runner_id: runnerId });
    if (existingRunnerUrl) {
        const url = yield url_1.Url.findById(existingRunnerUrl.url_id);
        if (url) {
            return url.url;
        }
    }
    const urlCounts = yield runnerUrl_1.RunnerUrl.aggregate([
        { $group: { _id: '$url_id', count: { $sum: 1 } } },
    ]);
    const availableUrls = yield url_1.Url.find({
        _id: { $nin: urlCounts.map((urlCount) => urlCount._id) },
    }).sort({ priority: -1 });
    if (availableUrls.length === 0) {
        const leastUsedUrl = yield url_1.Url.findOne({
            _id: { $in: urlCounts.map((urlCount) => urlCount._id) },
        }).sort({ priority: -1, 'urlCounts.count': 1 });
        if (!leastUsedUrl) {
            return null;
        }
        const newRunnerUrl = new runnerUrl_1.RunnerUrl({
            runner_id: runnerId,
            url_id: leastUsedUrl._id,
            ip: runnerIp, // Add the IP field here
        });
        yield newRunnerUrl.save();
        return leastUsedUrl.url;
    }
    const newRunnerUrl = new runnerUrl_1.RunnerUrl({
        runner_id: runnerId,
        url_id: availableUrls[0]._id,
        ip: runnerIp, // Add the IP field here
    });
    yield newRunnerUrl.save();
    return availableUrls[0].url;
});
exports.assignUrlToRunner = assignUrlToRunner;
