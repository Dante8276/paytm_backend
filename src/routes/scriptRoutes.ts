import express, { Request, Response } from 'express';
import crypto from 'crypto';
import { Script, IScript } from '../models/script';
import { confirmCartHandler } from '../handlers/handleConfirmCart';

const router = express.Router();

// Get all scripts
router.get('/', async (req: Request, res: Response) => {
  try {
    const scripts = await Script.find();
    res.json(scripts);
  } catch (error) {
    console.error('Error retrieving scripts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Insert hardcoded scripts
router.get('/seed', async (req: Request, res: Response) => {
  try {
    const scripts = [
      {
        page: 'confirm-cart',
        matcher: `document.querySelector('span.css-nhg20t')`,
        handler: confirmCartHandler,
        handler_params: ['email'],
      },
    //   {
    //     page: 'add-tickets',
    //     matcher: `document.querySelector('p.css-199dqmw') && document.querySelector('p.css-199dqmw').textContent === 'Choose Tickets')`,
    //     handler: `async function() {
    //       // Handler function for checkout page
    //       console.log('Executing handler for add-tickets page');
    //       // Add your custom logic here
    //     }`,
    //   },
      {
        page: 'event',
        matcher: `document.querySelector('a[data-ref="edp_buy_button_desktop"]')`,
        handler: `async function() {
          // Handler function for checkout page
          console.log('Executing handler for event page');
          // Add your custom logic here
          const buyNowButton = document.querySelector('a[data-ref="edp_buy_button_desktop"]');
          if (buyNowButton) {
            buyNowButton.click();
          }
        }`,
      },
    //   {
    //     page: 'seatmap',
    //     matcher: `document.querySelector('div[id="topLevelSeatmap"]')`,
    //     handler: `async function() {
    //       // Handler function for checkout page
    //       console.log('Executing handler for seatmap page');
    //       // Add your custom logic here
    //     }`,
    //   },
    //   {
    //     page: 'seatmap-fallback',
    //     matcher: `document.querySelector('a.css-1k17l6h') && document.querySelector('a.css-1k17l6h').textContent === 'BOOK')`,
    //     handler: `async function() {
    //       // Handler function for checkout page
    //       console.log('Executing handler for seatmap-fallback page');
    //       // Add your custom logic here
    //     }`,
    //   },
    //   {
    //     page: 'seating-chart',
    //     matcher: `document.querySelector('iframe[title="seating chart"]')`,
    //     handler: `async function() {
    //       // Handler function for checkout page
    //       console.log('Executing handler for seating-chart page');
    //       // Add your custom logic here
    //     }`,
    //   },
    //   {
    //     page: 'add-ons',
    //     matcher: `document.querySelector('h6') && document.querySelector('h6').textContent === 'ADD-ONS'`,
    //     handler: `async function() {
    //       // Handler function for checkout page
    //       console.log('Executing handler for add-ons page');
    //       // Add your custom logic here
    //     }`,
    //   },
    //   {
    //     page: 'payment',
    //     matcher: `document.querySelector('h1') && document.querySelector('h1').textContent === 'Payment Methods'`,
    //     handler: `async function() {
    //       // Handler function for checkout page
    //       console.log('Executing handler for payment page');
    //       // Add your custom logic here
    //     }`,
    //   },
      
      // Add more scripts as needed
    ];

    const insertedScripts: IScript[] = [];

    for (const script of scripts) {
        const hash = crypto
          .createHash('md5')
          .update(`${script.matcher}${script.handler}${JSON.stringify(script.handler_params)}`)
          .digest('hex');
        const newScript = new Script({ ...script, hash });
        await newScript.save();
        insertedScripts.push(newScript);
      }

    res.status(201).json(insertedScripts);
  } catch (error) {
    console.error('Error seeding scripts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;