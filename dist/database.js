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
exports.connectToDatabase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
// const MONGODB_URI = 'mongodb://127.0.0.1:27017/paytmdb';
// since this repo is running in a docker container, the host name should be the name of the service in the docker-compose file
// const MONGODB_URI = 'mongodb://backend:27017/paytmdb';
// const MONGODB_URI = 'mongodb://mongoadmin:secret@mongodb:27017/paytmdb?authSource=admin';
// const MONGODB_URI = 'mongodb://mongoadmin:secret@mongodb:27017/paytmdb?authSource=admin';
const MONGODB_URI = 'mongodb://mongoadmin:secret@127.0.0.1:27017/paytmdb?authSource=admin';
const connectToDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(MONGODB_URI);
        console.log('Connected to MongoDB');
    }
    catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
});
exports.connectToDatabase = connectToDatabase;
