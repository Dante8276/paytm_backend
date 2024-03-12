import express, { Request, Response } from 'express';
import { Transaction, ITransaction } from '../models/transaction';
import { Runner } from '../models/runner';
import { PaymentMethod } from '../models/paymentMethod';
import mongoose from 'mongoose';

const router = express.Router();

// Create a new transaction
router.post('/', async (req: Request, res: Response) => {
    try {
        const transactionData: ITransaction = req.body;
        const newTransaction = new Transaction(transactionData);
        await newTransaction.save();
        res.status(201).json(newTransaction);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get all transactions
router.get('/', async (req: Request, res: Response) => {
    try {
        const transactions = await Transaction.find();
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get a specific transaction by ID
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }
        res.json(transaction);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update a specific transaction by ID
router.put('/:id', async (req: Request, res: Response) => {
    try {
        const updatedTransaction = await Transaction.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedTransaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }
        res.json(updatedTransaction);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete a specific transaction by ID
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const deletedTransaction = await Transaction.findByIdAndDelete(req.params.id);
        if (!deletedTransaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }
        res.sendStatus(204);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create a new transaction by email and user name
router.get('/:email/:user_name/:payment_method_name/:amount', async (req: Request, res: Response) => {
    try {
        const email = req.params.email;
        const userName = req.params.user_name;
        const paymentMethodName = req.params.payment_method_name;
        const amount_unparsed = req.params.amount;
        const date = new Date();

        // Check if amount is a number and convert it to a number
        const amount = Number(amount_unparsed);


        const runner = await Runner.findOne({ email, name: userName });

        if (!runner) {
            return res.status(404).json({ error: 'Runner not found' });
        }

        const paymentMethod = await PaymentMethod.findOne({ name: paymentMethodName });

        if (!paymentMethod) {
            return res.status(404).json({ error: 'Payment method not found' });
        }

        const transactionData: ITransaction = {
            payment_method_id: paymentMethod._id,
            runner_id: runner._id,
            amount: amount,
            date: date
        };

        const newTransaction = new Transaction(transactionData);
        await newTransaction.save();

        res.status(201).json(newTransaction);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;