import express, { Request, Response } from 'express';
import { EmailData, IEmailData } from '../models/emailData';

const router = express.Router();

// Create a new email data entry
router.post('/', async (req: Request, res: Response) => {
  try {
    const emailData: IEmailData = req.body;
    const newEmailData = new EmailData(emailData);
    await newEmailData.save();
    res.status(201).json(newEmailData);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all email data entries
router.get('/', async (req: Request, res: Response) => {
  try {
    const emailDataList = await EmailData.find();
    res.json(emailDataList);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a specific email data entry by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const emailData = await EmailData.findById(req.params.id);
    if (!emailData) {
      return res.status(404).json({ error: 'Email data not found' });
    }
    res.json(emailData);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a specific email data entry by to_mail, get the one with latest date
// curl example: 
/*
curl -X GET http://localhost:3000/api/emailData/to_mail/:test4@basiccamping.club
*/
router.get('/to_mail/:to_mail', async (req: Request, res: Response) => {
  try {
    console.log('to_mail:', req.params.to_mail);
    const emailData
        = await EmailData.findOne({ to_mail: req.params.to_mail, is_already_used: false }).sort({ date: -1 });
    if (!emailData) {
        return res.status(404).json({ error: 'Email data not found' });
        }
    res.json(emailData);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}
);



// Update a specific email data entry by ID
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const updatedEmailData = await EmailData.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedEmailData) {
      return res.status(404).json({ error: 'Email data not found' });
    }
    res.json(updatedEmailData);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a specific email data entry by ID
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const deletedEmailData = await EmailData.findByIdAndDelete(req.params.id);
    if (!deletedEmailData) {
      return res.status(404).json({ error: 'Email data not found' });
    }
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;