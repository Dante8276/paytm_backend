import express, { Request, Response } from 'express';
import { Runner, IRunner } from '../models/runner';
import { UserData, IUserData } from '../models/userData';

const router = express.Router();

// Create a new runner
router.post('/', async (req: Request, res: Response) => {
    try {
        const runnerData: IRunner = req.body;
        const newRunner = new Runner(runnerData);
        await newRunner.save();
        res.status(201).json(newRunner);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get all runners
router.get('/', async (req: Request, res: Response) => {
    try {
        const runners = await Runner.find();
        res.json(runners);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get a specific runner by ID
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const runner = await Runner.findById(req.params.id);
        if (!runner) {
            return res.status(404).json({ error: 'Runner not found' });
        }
        res.json(runner);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update a specific runner by ID
router.put('/:id', async (req: Request, res: Response) => {
    try {
        const updatedRunner = await Runner.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedRunner) {
            return res.status(404).json({ error: 'Runner not found' });
        }
        res.json(updatedRunner);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete a specific runner by ID
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const deletedRunner = await Runner.findByIdAndDelete(req.params.id);
        if (!deletedRunner) {
            return res.status(404).json({ error: 'Runner not found' });
        }
        res.sendStatus(204);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/user/:email', async (req: Request, res: Response) => {
    try {
        const runner = await Runner.findOne({ email: req.params.email });
        if (runner) {
            const userData = await UserData.findOne({ name: runner.name });
            if (userData) {
                return res.json(userData);
            }
        }

        // If runner or user not found, find the user with least n_times_used
        const leastUsedUser = await UserData.findOne().sort({ n_times_used: 1 });
        if (leastUsedUser) {
            const newRunner = new Runner({
                email: req.params.email,
                name: leastUsedUser.name,
            });
            await newRunner.save();
            await UserData.findByIdAndUpdate(leastUsedUser._id, { $inc: { n_times_used: 1 } });
            return res.json(leastUsedUser);
        }

        res.status(404).json({ error: 'Address not found' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});



export default router;