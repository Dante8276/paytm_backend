import express, { Request, Response, request } from 'express';
import { UserData, IUserData } from '../models/userData';

const router = express.Router();

// Create a new user data entry
router.post('/', async (req: Request, res: Response) => {
  try {
    const userData: IUserData = req.body;
    const newUserData = new UserData(userData);
    await newUserData.save();
    res.status(201).json(newUserData);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all user data entries
router.get('/', async (req: Request, res: Response) => {
  try {
    const userDataList = await UserData.find();
    res.json(userDataList);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// get first entry with n_times_used < 10
router.get('/times_limit/:limit', async (req: Request, res: Response) => {
  try {
    const userData = await UserData.findOne({ n_times_used: { $lt: req.params.limit} });
    if (!userData) {
      return res.status(404).json({ error: 'User data not found' });
    }
    //  update n_times_used of this entry, add 1
    try {
        const updatedUserData = await UserData.findByIdAndUpdate(
        userData._id,
        { n_times_used: userData.n_times_used + 1 },
        { new: true }
        );
    }
    catch (error) {
        res.status(500).json({ error: 'Unable to add 1' });
    }
   

    res.json(userData);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get a specific user data entry by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const userData = await UserData.findById(req.params.id);
    if (!userData) {
      return res.status(404).json({ error: 'User data not found' });
    }
    res.json(userData);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a specific user data entry by ID
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const updatedUserData = await UserData.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedUserData) {
      return res.status(404).json({ error: 'User data not found' });
    }
    res.json(updatedUserData);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a specific user data entry by ID
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const deletedUserData = await UserData.findByIdAndDelete(req.params.id);
    if (!deletedUserData) {
      return res.status(404).json({ error: 'User data not found' });
    }
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;