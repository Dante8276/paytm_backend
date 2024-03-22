import express, { Request, Response } from 'express';
import axios from 'axios';
import { InsiderData } from '../models/insiderData';

const router = express.Router();

// Get insider data by event name and seat name
router.get('/:eventname/:seatname', async (req: Request, res: Response) => {
  try {
    const eventName = req.params.eventname;
    const seatName = req.params.seatname;
    console.log("event name: ", eventName);
    console.log("seat name: ", seatName);

    const insiderData = await getInsiderData(eventName, seatName);
    console.log("insider data: ", insiderData);

    if (insiderData) {
      const renderingInfo = await getRenderingInfo(insiderData.seatsIoId);

      if (renderingInfo) {
        const rgb = hexToRgb(renderingInfo.color);
        const maxPurchasePerUser = insiderData.maxPurchasePerUser;
        res.json({ rgb, maxPurchasePerUser });
      } else {
        res.status(404).json({ error: 'Category with key 1 not found' });
      }
    } else {
      res.status(404).json({ error: 'Seat data not found' });
    }
  } catch (error) {
    console.log("Internal server error in get insider data: ", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Helper function to get insider data
async function getInsiderData(eventName: string, seatName: string) {
  const existingData = await InsiderData.findOne({ event_name: eventName }).sort({ created_at: -1 });

  if (existingData) {
    const currentDate = new Date();
    const timeDiff = currentDate.getTime() - existingData.created_at.getTime();
    const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));

    if (daysDiff < 10) {
      return {
        insiderResponse: existingData.event_metadata,
        seatsIoId: getSeatsIoId(existingData.event_metadata, seatName),
        maxPurchasePerUser: getMaxPurchasePerUser(existingData.event_metadata, seatName)
      };
    } else {
      const insiderResponse = await fetchInsiderData(eventName);
      existingData.event_metadata = insiderResponse;
      existingData.created_at = new Date();
      await existingData.save();
      return {
        insiderResponse,
        seatsIoId: getSeatsIoId(insiderResponse, seatName),
        maxPurchasePerUser: getMaxPurchasePerUser(insiderResponse, seatName)
      };
    }
  } else {
    const insiderResponse = await fetchInsiderData(eventName);
    return {
      insiderResponse,
      seatsIoId: getSeatsIoId(insiderResponse, seatName),
      maxPurchasePerUser: getMaxPurchasePerUser(insiderResponse, seatName)
    };
  }
}

// Helper function to fetch insider data from API
async function fetchInsiderData(eventName: string) {
  try {
    const response = await axios.get(`https://api.insider.in/event/getBySlug/${eventName}`);
    return response.data.data.venue;
  } catch (error) {
    console.log("error in getBySlug : ", error);
    throw new Error('API error issue');
  }
}

// Helper function to get seats.io ID
function getSeatsIoId(insiderResponse: any, seatName: string) {
  const seat = insiderResponse.shows[0].items_for_sale.find((item: any) => item.name === seatName);
  return seat ? seat.seats_io_id || '' : '';
}

// Helper function to get max purchase per user
function getMaxPurchasePerUser(insiderResponse: any, seatName: string) {
  const seat = insiderResponse.shows[0].items_for_sale.find((item: any) => item.name === seatName);
  return seat ? (seat.items[0]?.max_purchase_per_user || 0) : 0;
}

// Helper function to get rendering info
async function getRenderingInfo(seatsIoId: string) {
  try {
    const response = await axios.get(`https://cdn-eu.seatsio.net/system/public/135e9fa6-95fe-41b0-8baf-f3ccca384036/rendering-info?event_key=${seatsIoId}`);
    return response.data.categories.find((cat: any) => cat.key === 1);
  } catch (error) {
    console.log("Error retrieving rendering info: ", error);
    throw new Error('Error retrieving rendering info');
  }
}

// Helper function to convert hex color to RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
}

export default router;
