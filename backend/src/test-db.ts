import dotenv from 'dotenv';
import connectDB from './config/db';

dotenv.config();

const testConnection = async () => {
  try {
    await connectDB();
    console.log('✅ Database connection successful!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};

testConnection(); 