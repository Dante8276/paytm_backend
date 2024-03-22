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
const paymentMethod_1 = require("../models/paymentMethod");
const router = express_1.default.Router();
// Create a new payment method
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const paymentMethodData = req.body;
        const newPaymentMethod = new paymentMethod_1.PaymentMethod(paymentMethodData);
        yield newPaymentMethod.save();
        res.status(201).json(newPaymentMethod);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// Get all payment methods
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const paymentMethods = yield paymentMethod_1.PaymentMethod.find();
        res.json(paymentMethods);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// Get a specific payment method by ID
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const paymentMethod = yield paymentMethod_1.PaymentMethod.findById(req.params.id);
        if (!paymentMethod) {
            return res.status(404).json({ error: 'Payment method not found' });
        }
        res.json(paymentMethod);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// Update a specific payment method by ID
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedPaymentMethod = yield paymentMethod_1.PaymentMethod.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedPaymentMethod) {
            return res.status(404).json({ error: 'Payment method not found' });
        }
        res.json(updatedPaymentMethod);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// Delete a specific payment method by ID
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedPaymentMethod = yield paymentMethod_1.PaymentMethod.findByIdAndDelete(req.params.id);
        if (!deletedPaymentMethod) {
            return res.status(404).json({ error: 'Payment method not found' });
        }
        res.sendStatus(204);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// Get a suitable payment method based on amount and method type
router.get('/:amount/:method_type', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const amount = parseFloat(req.params.amount);
        const methodType = req.params.method_type;
        const paymentMethod = yield paymentMethod_1.PaymentMethod.findOneAndUpdate({
            method_type: methodType,
            single_transaction_limit: { $gt: amount },
            total_amount_limit: { $gte: amount },
            is_available: true,
        }, {
            $inc: {
                max_transactions_count: -1,
                total_amount_limit: -amount,
            },
        }, {
            sort: { max_transactions_count: 1, priority: -1 },
            new: true,
        });
        if (!paymentMethod) {
            return res.status(404).json({ error: 'No suitable payment method found' });
        }
        res.json(paymentMethod);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}));
exports.default = router;
