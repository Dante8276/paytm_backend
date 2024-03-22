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
const userData_1 = require("../models/userData");
const router = express_1.default.Router();
// Create a new user data entry
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userData = req.body;
        const newUserData = new userData_1.UserData(userData);
        yield newUserData.save();
        res.status(201).json(newUserData);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// Get all user data entries
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userDataList = yield userData_1.UserData.find();
        res.json(userDataList);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// get first entry with n_times_used < 10
router.get('/times_limit/:limit', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userData = yield userData_1.UserData.findOne({ n_times_used: { $lt: req.params.limit } });
        if (!userData) {
            return res.status(404).json({ error: 'User data not found' });
        }
        //  update n_times_used of this entry, add 1
        try {
            const updatedUserData = yield userData_1.UserData.findByIdAndUpdate(userData._id, { n_times_used: userData.n_times_used + 1 }, { new: true });
        }
        catch (error) {
            res.status(500).json({ error: 'Unable to add 1' });
        }
        res.json(userData);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// Get a specific user data entry by ID
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userData = yield userData_1.UserData.findById(req.params.id);
        if (!userData) {
            return res.status(404).json({ error: 'User data not found' });
        }
        res.json(userData);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// Update a specific user data entry by ID
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedUserData = yield userData_1.UserData.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedUserData) {
            return res.status(404).json({ error: 'User data not found' });
        }
        res.json(updatedUserData);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// Delete a specific user data entry by ID
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedUserData = yield userData_1.UserData.findByIdAndDelete(req.params.id);
        if (!deletedUserData) {
            return res.status(404).json({ error: 'User data not found' });
        }
        res.sendStatus(204);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}));
exports.default = router;
