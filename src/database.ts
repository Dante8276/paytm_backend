import mongoose from 'mongoose';

// const MONGODB_URI = 'mongodb://127.0.0.1:27017/paytmdb';

// since this repo is running in a docker container, the host name should be the name of the service in the docker-compose file
// const MONGODB_URI = 'mongodb://backend:27017/paytmdb';
// const MONGODB_URI = 'mongodb://mongoadmin:secret@mongodb:27017/paytmdb?authSource=admin';
const MONGODB_URI = 'mongodb://mongoadmin:secret@mongodb:27017/paytmdb?authSource=admin';

export const connectToDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};