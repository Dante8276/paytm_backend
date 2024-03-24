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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const runner_1 = require("../models/runner");
const userData_1 = require("../models/userData");
const url_1 = require("../models/url");
const runnerUrl_1 = require("../models/runnerUrl");
const assignUrl_1 = require("../utils/assignUrl");
const email_1 = require("../models/email");
const domain_1 = require("../models/domain");
const router = express_1.default.Router();
// Create a new runner
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const runnerData = req.body;
        const newRunner = new runner_1.Runner(runnerData);
        yield newRunner.save();
        res.status(201).json(newRunner);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// Get all runners
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const runners = yield runner_1.Runner.find();
        res.json(runners);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// Get a specific runner by ID
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const runner = yield runner_1.Runner.findById(req.params.id);
        if (!runner) {
            return res.status(404).json({ error: 'Runner not found' });
        }
        res.json(runner);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// Update a specific runner by ID
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedRunner = yield runner_1.Runner.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedRunner) {
            return res.status(404).json({ error: 'Runner not found' });
        }
        res.json(updatedRunner);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// Delete a specific runner by ID
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedRunner = yield runner_1.Runner.findByIdAndDelete(req.params.id);
        if (!deletedRunner) {
            return res.status(404).json({ error: 'Runner not found' });
        }
        res.sendStatus(204);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// Get user data by runner IP
// Get user data by runner IP
router.get('/user/:ip', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const runner = yield runner_1.Runner.findOne({ ip: req.params.ip });
        if (runner) {
            const runnerUrl = yield runnerUrl_1.RunnerUrl.findOne({ runner_id: runner._id });
            if (runnerUrl) {
                const url = yield url_1.Url.findById(runnerUrl.url_id);
                const email = yield email_1.Email.findOne({ email: runner.email });
                const userData = yield userData_1.UserData.findOne({ name: runner.name });
                if (url && email && userData) {
                    return res.json({ email: email.email, userData, url: url.url });
                }
            }
            else {
                // If runner exists but no URL is assigned, assign a new URL
                const url = yield (0, assignUrl_1.assignUrlToRunner)(runner._id.toString(), req.params.ip);
                if (!url) {
                    return res.status(404).json({ error: 'No available URLs' });
                }
                return res.json({ email: runner.email, userData: yield userData_1.UserData.findOne({ name: runner.name }), url });
            }
        }
        const domain = yield domain_1.Domain.findOneAndUpdate({}, { $inc: { count: 1 } }, { sort: { priority: -1, count: 1 }, new: true });
        if (!domain) {
            return res.status(404).json({ error: 'No available domains' });
        }
        const emailNames = [
            // 'john',
            'doe',
            'jane',
            'smith',
            'peter',
            'parker',
            'tony',
            'stark',
            'bruce',
            'wayne',
        ];
        // const randomEmail = emailNames[Math.floor(Math.random() * emailNames.length)] + Math.floor(Math.random() * 1000) + "@" + domain.domain;
        const email = new email_1.Email({
            email: `${emailNames[Math.floor(Math.random() * emailNames.length)] + Math.floor(Math.random() * 1000)}@${domain.domain}`,
            domain: domain.domain,
        });
        yield email.save();
        const leastUsedUser = yield userData_1.UserData.findOne().sort({ n_times_used: 1 });
        if (!leastUsedUser) {
            return res.status(404).json({ error: 'No available users' });
        }
        const newRunner = new runner_1.Runner({
            email: email.email,
            name: leastUsedUser.name,
            ip: req.params.ip,
            is_active: true,
        });
        yield newRunner.save();
        yield userData_1.UserData.findByIdAndUpdate(leastUsedUser._id, { $inc: { n_times_used: 1 } });
        const url = yield (0, assignUrl_1.assignUrlToRunner)(newRunner._id.toString(), req.params.ip);
        if (!url) {
            return res.status(404).json({ error: 'No available URLs' });
        }
        res.json({ email: email.email, userData: leastUsedUser, url });
    }
    catch (error) {
        console.error('Error in /user/:ip route:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// Check runner health based on IP
router.get('/health/:ip', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const runner = yield runner_1.Runner.findOne({ ip: req.params.ip });
        if (!runner) {
            return res.status(404).json({ error: 'Runner not found' });
        }
        res.json({ is_active: runner.is_active });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// Assign a URL to a runner based on IP
router.post('/assign-url/:ip', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const runner = yield runner_1.Runner.findOne({ ip: req.params.ip });
        if (!runner) {
            return res.status(404).json({ error: 'Runner not found' });
        }
        const url = yield (0, assignUrl_1.assignUrlToRunner)(runner._id.toString(), req.params.ip);
        if (!url) {
            return res.status(404).json({ error: 'No available URLs' });
        }
        res.json({ url });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}));
exports.default = router;
