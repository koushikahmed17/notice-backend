import app from '../src/app';
import mongoose from 'mongoose';
import env from '../src/config/environment';
import logger from '../src/config/logger';

// Cache database connection across serverless invocations
let cachedConnection: typeof mongoose | null = null;

// Initialize database connection with caching
const connectDatabase = async (): Promise<void> => {
  if (cachedConnection && mongoose.connection.readyState === 1) {
    logger.info('Using existing database connection');
    return;
  }

  try {
    if (!cachedConnection) {
      cachedConnection = await mongoose.connect(env.MONGODB_URI);
      logger.info(`✅ MongoDB Connected: ${cachedConnection.connection.host}`);
    } else if (mongoose.connection.readyState === 0) {
      // Reconnect if connection was lost
      await mongoose.connect(env.MONGODB_URI);
      logger.info('MongoDB reconnected');
    }
  } catch (error) {
    logger.error(`❌ MongoDB connection error: ${error}`);
    cachedConnection = null;
    throw error;
  }
};

// Vercel serverless function handler
export default async function handler(req: any, res: any) {
  // Initialize database if not already connected
  try {
    await connectDatabase();
  } catch (error) {
    logger.error('Database connection failed:', error);
    return res.status(500).json({
      success: false,
      message: 'Database connection failed',
    });
  }
  
  // Handle the request with Express app
  return app(req, res);
}

