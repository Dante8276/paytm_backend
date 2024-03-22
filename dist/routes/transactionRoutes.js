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
const transaction_1 = require("../models/transaction");
const runner_1 = require("../models/runner");
const paymentMethod_1 = require("../models/paymentMethod");
const router = express_1.default.Router();
// Create a new transaction
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transactionData = req.body;
        const newTransaction = new transaction_1.Transaction(transactionData);
        yield newTransaction.save();
        res.status(201).json(newTransaction);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// Get all transactions
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transactions = yield transaction_1.Transaction.find();
        res.json(transactions);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// Get a specific transaction by ID
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transaction = yield transaction_1.Transaction.findById(req.params.id);
        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }
        res.json(transaction);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// Update a specific transaction by ID
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedTransaction = yield transaction_1.Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedTransaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }
        res.json(updatedTransaction);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// Delete a specific transaction by ID
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedTransaction = yield transaction_1.Transaction.findByIdAndDelete(req.params.id);
        if (!deletedTransaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }
        res.sendStatus(204);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// Create a new transaction by email and user name
router.get('/:email/:user_name/:payment_method_name/:amount', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.params.email;
        const userName = req.params.user_name;
        const paymentMethodName = req.params.payment_method_name;
        const amount_unparsed = req.params.amount;
        const date = new Date();
        // Check if amount is a number and convert it to a number
        const amount = Number(amount_unparsed);
        const runner = yield runner_1.Runner.findOne({ email, name: userName });
        if (!runner) {
            return res.status(404).json({ error: 'Runner not found' });
        }
        const paymentMethod = yield paymentMethod_1.PaymentMethod.findOne({ name: paymentMethodName });
        if (!paymentMethod) {
            return res.status(404).json({ error: 'Payment method not found' });
        }
        const transactionData = {
            payment_method_id: paymentMethod._id,
            runner_id: runner._id,
            amount: amount,
            date: date
        };
        const newTransaction = new transaction_1.Transaction(transactionData);
        yield newTransaction.save();
        res.status(201).json(newTransaction);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}));
exports.default = router;
