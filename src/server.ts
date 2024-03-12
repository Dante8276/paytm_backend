import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { connectToDatabase } from './database';
import emailDataRoutes from './routes/emailDataRoutes';
import userDataRoutes from './routes/userDataRoutes';

const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());

app.use(bodyParser.json());
app.use('/api/emailData', emailDataRoutes);
app.use('/api/userData', userDataRoutes);

// Start the server
app.listen(port, async () => {
  await connectToDatabase();
  console.log(`Server is running on port ${port}`);
});