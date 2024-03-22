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
router.get('/user/:email', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const runner = yield runner_1.Runner.findOne({ email: req.params.email });
        if (runner) {
            const userData = yield userData_1.UserData.findOne({ name: runner.name });
            if (userData) {
                return res.json(userData);
            }
        }
        // If runner or user not found, find the user with least n_times_used
        const leastUsedUser = yield userData_1.UserData.findOne().sort({ n_times_used: 1 });
        if (leastUsedUser) {
            const newRunner = new runner_1.Runner({
                email: req.params.email,
                name: leastUsedUser.name,
            });
            yield newRunner.save();
            yield userData_1.UserData.findByIdAndUpdate(leastUsedUser._id, { $inc: { n_times_used: 1 } });
            return res.json(leastUsedUser);
        }
        res.status(404).json({ error: 'Address not found' });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}));
exports.default = router;
