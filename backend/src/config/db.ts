import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not defined');
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      maxPoolSize: 50, // Maintain up to 50 socket connections
    });

    // Enable strict query mode for better security
    mongoose.set('strictQuery', true);
    
    // Enable strict population for better security
    mongoose.set('strictPopulate', true);

    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Handle connection errors
    conn.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    conn.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      try {
        await conn.connection.close();
        console.log('MongoDB connection closed through app termination');
        process.exit(0);
      } catch (err) {
        console.error('Error during MongoDB connection closure:', err);
        process.exit(1);
      }
    });

  } catch (error: any) {
    console.error(`Error: ${error.message || 'Failed to connect to database'}`);
    process.exit(1);
  }
};

export default connectDB; 