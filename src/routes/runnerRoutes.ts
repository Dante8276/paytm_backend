import express, { Request, Response } from 'express';
import { Runner, IRunner } from '../models/runner';
import { UserData, IUserData } from '../models/userData';
import { Url, IUrl } from '../models/url';
import { RunnerUrl } from '../models/runnerUrl';
import { assignUrlToRunner } from '../utils/assignUrl';
import { Email } from '../models/email';
import { Domain } from '../models/domain';

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

// Get user data by runner IP
// Get user data by runner IP
router.get('/user/:ip', async (req: Request, res: Response) => {
    try {
      const runner = await Runner.findOne({ ip: req.params.ip });
      if (runner) {
        const runnerUrl = await RunnerUrl.findOne({ runner_id: runner._id });
        if (runnerUrl) {
          const url = await Url.findById(runnerUrl.url_id);
          const email = await Email.findOne({ email: runner.email });
          const userData = await UserData.findOne({ name: runner.name });
          if (url && email && userData) {
            return res.json({ email: email.email, userData, url: url.url });
          }
        } else {
          // If runner exists but no URL is assigned, assign a new URL
          const url = await assignUrlToRunner(runner._id.toString(), req.params.ip);
          if (!url) {
            return res.status(404).json({ error: 'No available URLs' });
          }
          return res.json({ email: runner.email, userData: await UserData.findOne({ name: runner.name }), url });
        }
      }
  
      const domain = await Domain.findOneAndUpdate(
        {},
        { $inc: { count: 1 } },
        { sort: { priority: -1, count: 1 }, new: true }
      );
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
    ]
    // const randomEmail = emailNames[Math.floor(Math.random() * emailNames.length)] + Math.floor(Math.random() * 1000) + "@" + domain.domain;
  
      const email = new Email({
        email: `${emailNames[Math.floor(Math.random() * emailNames.length)] + Math.floor(Math.random() * 1000)}@${domain.domain}`,
        domain: domain.domain,
      });
      await email.save();
  
      const leastUsedUser = await UserData.findOne().sort({ n_times_used: 1 });
      if (!leastUsedUser) {
        return res.status(404).json({ error: 'No available users' });
      }
  
      const newRunner = new Runner({
        email: email.email,
        name: leastUsedUser.name,
        ip: req.params.ip,
        is_active: true,
      });
      await newRunner.save();
  
      await UserData.findByIdAndUpdate(leastUsedUser._id, { $inc: { n_times_used: 1 } });
  
      const url = await assignUrlToRunner(newRunner._id.toString(), req.params.ip);
      if (!url) {
        return res.status(404).json({ error: 'No available URLs' });
      }
  
      res.json({ email: email.email, userData: leastUsedUser, url });
    } catch (error) {
      console.error('Error in /user/:ip route:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

// Check runner health based on IP
router.get('/health/:ip', async (req: Request, res: Response) => {
    try {
        const runner = await Runner.findOne({ ip: req.params.ip });
        if (!runner) {
            return res.status(404).json({ error: 'Runner not found' });
        }
        res.json({ is_active: runner.is_active });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Assign a URL to a runner based on IP
router.post('/assign-url/:ip', async (req: Request, res: Response) => {
    try {
        const runner = await Runner.findOne({ ip: req.params.ip });
        if (!runner) {
            return res.status(404).json({ error: 'Runner not found' });
        }

        const url = await assignUrlToRunner(runner._id.toString(), req.params.ip);
        if (!url) {
            return res.status(404).json({ error: 'No available URLs' });
        }

        res.json({ url });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;