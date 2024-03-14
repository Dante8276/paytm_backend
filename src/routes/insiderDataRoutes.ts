import express, { Request, Response } from 'express';
import axios from 'axios';
import { InsiderData, IInsiderDataDocument } from '../models/insiderData';

const router = express.Router();

// Get insider data by event name and seat name
router.get('/:eventname/:seatname', async (req: Request, res: Response) => {
  try {
    const eventName = req.params.eventname;
    const seatName = req.params.seatname;
    console.log("event name: ", eventName);
    console.log("seat name: ", seatName);

    // Check if a row with the event name already exists
    const existingData = await InsiderData.findOne({ event_name: eventName }).sort({ created_at: -1 });

    let insiderResponse: any;
    let seatsIoId: string = '';

    if (existingData) {
      const currentDate = new Date();
      const timeDiff = currentDate.getTime() - existingData.created_at.getTime();
      const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));

      if (daysDiff < 10) {
        // Use the existing data if it's less than a day old
        insiderResponse = existingData.event_metadata;
        
        seatsIoId = insiderResponse.shows[0].items_for_sale.find((item: any) => item.name === seatName).seats_io_id || '';
      } else {
        // Make an HTTP request to the Insider API
        const response = await axios.get(`https://api.insider.in/event/getBySlug/${eventName}`);
        insiderResponse = response.data.data.venue;

        // Update the existing row with the new data
        existingData.event_metadata = insiderResponse;
        existingData.created_at = new Date();
        // existingData.items = buildItemsObject(insiderResponse.shows[0].items_for_sale);
        await existingData.save();

        seatsIoId = insiderResponse.shows[0].items_for_sale.find((item: any) => item.name === seatName).seats_io_id || '';
      }
    } else {
      console.log("event not found");
      // Make an HTTP request to the Insider API
      try {
        const response = await axios.get(`https://api.insider.in/event/getBySlug/${eventName}`);
        insiderResponse = response.data.data.venue;
      } catch (error) {
        console.log("error in getBySlug : ", error);
        res.status(404).json({ error: 'API error issue' });
      }
      console.log("insiderResponse: ", insiderResponse);

      // Create a new row in the insider_data collection
      // const newData: IInsiderDataDocument = new InsiderData({
      //   event_name: eventName,
      //   event_metadata: {shows : insiderResponse.shows},
      //   created_at: new Date(),
      //   // items: buildItemsObject(insiderResponse.shows[0].items_for_sale),
      // });
      // await newData.save();

      seatsIoId = insiderResponse.shows[0].items_for_sale.find((item: any) => item.name === seatName).seats_io_id || '';
    }

    // Find the seat data based on the seat name
    const seatData = insiderResponse.shows[0].items_for_sale.find((item: any) => item.name === seatName);
    console.log("seatData: ", seatData);

    if (seatData) {
      try {
        // Make an API call to retrieve rendering info using seats_io_id
        const renderingInfoResponse = await axios.get(`https://cdn-eu.seatsio.net/system/public/135e9fa6-95fe-41b0-8baf-f3ccca384036/rendering-info?event_key=${seatsIoId}`);
        const renderingInfo = renderingInfoResponse.data;

        // Find the category with "key": 1 in the categories array
        const category = renderingInfo.categories.find((cat: any) => cat.key === 1);

        if (category) {
          const color = category.color;
          const rgb = hexToRgb(color);
          res.json(rgb);
        } else {
          res.status(404).json({ error: 'Category with key 1 not found' });
        }
      } catch (error) {
        console.log("Error retrieving rendering info: ", error);
        res.status(500).json({ error: 'Error retrieving rendering info' });
      }
    } else {
      res.status(404).json({ error: 'Seat data not found' });
    }
  } catch (error) {
    console.log("Internal server error in get insider data: ", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Helper function to build the items object
// function buildItemsObject(itemsForSale: any[]): { [key: string]: any } {
//   const itemsObject: { [key: string]: any } = {};
//   itemsForSale.forEach((item) => {
//     itemsObject[item.name] = item;
//   });
//   return itemsObject;
// }

// Helper function to convert hex color to RGB
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