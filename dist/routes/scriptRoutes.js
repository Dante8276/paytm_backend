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
const crypto_1 = __importDefault(require("crypto"));
const script_1 = require("../models/script");
const handleConfirmCart_1 = require("../handlers/handleConfirmCart");
const router = express_1.default.Router();
// Get all scripts
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const scripts = yield script_1.Script.find();
        res.json(scripts);
    }
    catch (error) {
        console.error('Error retrieving scripts:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// Insert hardcoded scripts
router.get('/seed', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const scripts = [
            {
                page: 'confirm-cart',
                matcher: `document.querySelector('span.css-nhg20t')`,
                handler: handleConfirmCart_1.confirmCartHandler,
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
                handler_params: [],
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
        const insertedScripts = [];
        for (const script of scripts) {
            const hash = crypto_1.default
                .createHash('md5')
                .update(`${script.matcher}${script.handler}${JSON.stringify(script.handler_params)}`)
                .digest('hex');
            const newScript = new script_1.Script(Object.assign(Object.assign({}, script), { hash }));
            yield newScript.save();
            insertedScripts.push(newScript);
        }
        res.status(201).json(insertedScripts);
    }
    catch (error) {
        console.error('Error seeding scripts:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
exports.default = router;
