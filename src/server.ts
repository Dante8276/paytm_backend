import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { connectToDatabase } from './database';
import emailDataRoutes from './routes/emailDataRoutes';
import userDataRoutes from './routes/userDataRoutes';
import paymentMethodRoutes from './routes/paymentMethodRoutes';
import runnerRoutes from './routes/runnerRoutes';
import transactionRoutes from './routes/transactionRoutes';

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use('/api/emailData', emailDataRoutes);
app.use('/api/userData', userDataRoutes);
app.use('/api/paymentMethod', paymentMethodRoutes);
app.use('/api/runner', runnerRoutes);
app.use('/api/transaction', transactionRoutes);

app.listen(port, async () => {
  await connectToDatabase();
  console.log(`Server is running on port ${port}`);
});