import dotenv from 'dotenv'

dotenv.config()

import mongoose from 'mongoose';

const connectDB = async () => {
    try {
      await mongoose.connect(process.env.localDB);
      console.log('DB connection established');
    } catch (error) {
      console.log('Error connecting', error.message);
    }
  
    const db = mongoose.connect;
    return db;
  };

export default connectDB





