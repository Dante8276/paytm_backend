import express, { Request, Response } from 'express';
import { PaymentMethod, IPaymentMethod } from '../models/paymentMethod';

const router = express.Router();

// Create a new payment method
router.post('/', async (req: Request, res: Response) => {
  try {
    const paymentMethodData: IPaymentMethod = req.body;
    const newPaymentMethod = new PaymentMethod(paymentMethodData);
    await newPaymentMethod.save();
    res.status(201).json(newPaymentMethod);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all payment methods
router.get('/', async (req: Request, res: Response) => {
  try {
    const paymentMethods = await PaymentMethod.find();
    res.json(paymentMethods);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a specific payment method by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const paymentMethod = await PaymentMethod.findById(req.params.id);
    if (!paymentMethod) {
      return res.status(404).json({ error: 'Payment method not found' });
    }
    res.json(paymentMethod);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a specific payment method by ID
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const updatedPaymentMethod = await PaymentMethod.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedPaymentMethod) {
      return res.status(404).json({ error: 'Payment method not found' });
    }
    res.json(updatedPaymentMethod);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a specific payment method by ID
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const deletedPaymentMethod = await PaymentMethod.findByIdAndDelete(req.params.id);
    if (!deletedPaymentMethod) {
      return res.status(404).json({ error: 'Payment method not found' });
    }
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a suitable payment method based on amount and method type
router.get('/:amount/:method_type', async (req: Request, res: Response) => {
    try {
      const amount = parseFloat(req.params.amount);
      const methodType = req.params.method_type;
  
      const paymentMethod = await PaymentMethod.findOneAndUpdate(
        {
          method_type: methodType,
          single_transaction_limit: { $gt: amount },
          total_amount_limit: { $gte: amount },
          is_available: true,
        },
        {
          $inc: {
            max_transactions_count: -1,
            total_amount_limit: -amount,
          },
        },
        {
          sort: { max_transactions_count: 1, priority: -1 },
          new: true,
        }
      );
  
      if (!paymentMethod) {
        return res.status(404).json({ error: 'No suitable payment method found' });
      }
  
      res.json(paymentMethod);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;