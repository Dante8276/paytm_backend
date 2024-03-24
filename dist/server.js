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
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const database_1 = require("./database");
const emailDataRoutes_1 = __importDefault(require("./routes/emailDataRoutes"));
const userDataRoutes_1 = __importDefault(require("./routes/userDataRoutes"));
const paymentMethodRoutes_1 = __importDefault(require("./routes/paymentMethodRoutes"));
const runnerRoutes_1 = __importDefault(require("./routes/runnerRoutes"));
const transactionRoutes_1 = __importDefault(require("./routes/transactionRoutes"));
const insiderDataRoutes_1 = __importDefault(require("./routes/insiderDataRoutes"));
const app = (0, express_1.default)();
const port = 3000;
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use('/api/emailData', emailDataRoutes_1.default);
app.use('/api/userData', userDataRoutes_1.default);
app.use('/api/paymentMethod', paymentMethodRoutes_1.default);
app.use('/api/runner', runnerRoutes_1.default);
app.use('/api/transaction', transactionRoutes_1.default);
app.use('/api/get_insider', insiderDataRoutes_1.default);
app.listen(port, () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, database_1.connectToDatabase)();
    console.log(`Server is running on port ${port}`);
}));
