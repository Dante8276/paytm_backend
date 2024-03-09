import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb://13.212.210.24:27017/paytmdb';

export const connectToDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};