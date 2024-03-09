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
const emailData_1 = require("../models/emailData");
const router = express_1.default.Router();
// Create a new email data entry
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const emailData = req.body;
        const newEmailData = new emailData_1.EmailData(emailData);
        yield newEmailData.save();
        res.status(201).json(newEmailData);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// Get all email data entries
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const emailDataList = yield emailData_1.EmailData.find();
        res.json(emailDataList);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// Get a specific email data entry by ID
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const emailData = yield emailData_1.EmailData.findById(req.params.id);
        if (!emailData) {
            return res.status(404).json({ error: 'Email data not found' });
        }
        res.json(emailData);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// Get a specific email data entry by to_mail, get the one with latest date
// curl example: 
/*
curl -X GET http://localhost:3000/api/emailData/to_mail/:test4@basiccamping.club
*/
router.get('/to_mail/:to_mail', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('to_mail:', req.params.to_mail);
        const emailData = yield emailData_1.EmailData.findOne({ to_mail: req.params.to_mail }).sort({ date: -1 });
        if (!emailData) {
            return res.status(404).json({ error: 'Email data not found' });
        }
        res.json(emailData);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// Update a specific email data entry by ID
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedEmailData = yield emailData_1.EmailData.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedEmailData) {
            return res.status(404).json({ error: 'Email data not found' });
        }
        res.json(updatedEmailData);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// Delete a specific email data entry by ID
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedEmailData = yield emailData_1.EmailData.findByIdAndDelete(req.params.id);
        if (!deletedEmailData) {
            return res.status(404).json({ error: 'Email data not found' });
        }
        res.sendStatus(204);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}));
exports.default = router;
