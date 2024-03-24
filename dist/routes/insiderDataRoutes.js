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
const axios_1 = __importDefault(require("axios"));
const insiderData_1 = require("../models/insiderData");
const router = express_1.default.Router();
// Get insider data by event name and seat name
router.get('/:eventname/:seatname', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const eventName = req.params.eventname;
        const seatName = req.params.seatname;
        console.log("event name: ", eventName);
        console.log("seat name: ", seatName);
        const insiderData = yield getInsiderData(eventName, seatName);
        console.log("insider data: ", insiderData);
        if (insiderData) {
            const renderingInfo = yield getRenderingInfo(insiderData.seatsIoId);
            if (renderingInfo) {
                const rgb = hexToRgb(renderingInfo.color);
                const maxPurchasePerUser = insiderData.maxPurchasePerUser;
                res.json({ rgb, maxPurchasePerUser });
            }
            else {
                res.status(404).json({ error: 'Category with key 1 not found' });
            }
        }
        else {
            res.status(404).json({ error: 'Seat data not found' });
        }
    }
    catch (error) {
        console.log("Internal server error in get insider data: ", error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// Helper function to get insider data
function getInsiderData(eventName, seatName) {
    return __awaiter(this, void 0, void 0, function* () {
        const existingData = yield insiderData_1.InsiderData.findOne({ event_name: eventName }).sort({ created_at: -1 });
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
            }
            else {
                const insiderResponse = yield fetchInsiderData(eventName);
                existingData.event_metadata = insiderResponse;
                existingData.created_at = new Date();
                yield existingData.save();
                return {
                    insiderResponse,
                    seatsIoId: getSeatsIoId(insiderResponse, seatName),
                    maxPurchasePerUser: getMaxPurchasePerUser(insiderResponse, seatName)
                };
            }
        }
        else {
            const insiderResponse = yield fetchInsiderData(eventName);
            return {
                insiderResponse,
                seatsIoId: getSeatsIoId(insiderResponse, seatName),
                maxPurchasePerUser: getMaxPurchasePerUser(insiderResponse, seatName)
            };
        }
    });
}
// Helper function to fetch insider data from API
function fetchInsiderData(eventName) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(`https://api.insider.in/event/getBySlug/${eventName}`);
            return response.data.data.venue;
        }
        catch (error) {
            console.log("error in getBySlug : ", error);
            throw new Error('API error issue');
        }
    });
}
// Helper function to get seats.io ID
function getSeatsIoId(insiderResponse, seatName) {
    const seat = insiderResponse.shows[0].items_for_sale.find((item) => item.name === seatName);
    return seat ? seat.seats_io_id || '' : '';
}
// Helper function to get max purchase per user
function getMaxPurchasePerUser(insiderResponse, seatName) {
    var _a;
    const seat = insiderResponse.shows[0].items_for_sale.find((item) => item.name === seatName);
    return seat ? (((_a = seat.items[0]) === null || _a === void 0 ? void 0 : _a.max_purchase_per_user) || 0) : 0;
}
// Helper function to get rendering info
function getRenderingInfo(seatsIoId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(`https://cdn-eu.seatsio.net/system/public/135e9fa6-95fe-41b0-8baf-f3ccca384036/rendering-info?event_key=${seatsIoId}`);
            return response.data.categories.find((cat) => cat.key === 1);
        }
        catch (error) {
            console.log("Error retrieving rendering info: ", error);
            throw new Error('Error retrieving rendering info');
        }
    });
}
// Helper function to convert hex color to RGB
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
        }
        : { r: 0, g: 0, b: 0 };
}
exports.default = router;
