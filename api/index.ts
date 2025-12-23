import { Request, Response } from 'express';
import mongoose from 'mongoose';

// Cache database connection across serverless invocations
let isConnecting = false;

// Initialize database connection with caching
const connectDatabase = async (): Promise<void> => {
  // Check if already connected
  if (mongoose.connection.readyState === 1) {
    return;
  }

  // Check if connection is in progress
  if (mongoose.connection.readyState === 2 || isConnecting) {
    // Wait for connection to complete
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('Database connection timeout')), 10000);
      mongoose.connection.once('connected', () => {
        clearTimeout(timeout);
        resolve();
      });
      mongoose.connection.once('error', (err) => {
        clearTimeout(timeout);
        reject(err);
      });
    });
  }

  try {
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is not set. Please add it in Vercel project settings.');
    }

    isConnecting = true;
    await mongoose.connect(mongoUri);
    isConnecting = false;
    console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
  } catch (error: any) {
    isConnecting = false;
    console.error(`❌ MongoDB connection error:`, error);
    throw error;
  }
};

// Lazy load app to avoid environment validation errors on import
let appInstance: any = null;

const getApp = async () => {
  if (!appInstance) {
    try {
      // Dynamically import app to catch any initialization errors
      const appModule = await import('../src/app');
      appInstance = appModule.default;
    } catch (error: any) {
      console.error('Error loading app:', error);
      throw error;
    }
  }
  return appInstance;
};

// Vercel serverless function handler
export default async function handler(req: Request, res: Response) {
  try {
    // Handle health check without requiring database or app initialization
    const url = req.url || req.path || '';
    if (url === '/health' || url === '/api/health' || url.endsWith('/health')) {
      return res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString(),
      });
    }

    // For other routes, load app and connect to database
    const app = await getApp();
    
    // Try to connect database (non-blocking for routes that don't need it)
    try {
      await connectDatabase();
    } catch (error: any) {
      console.error('Database connection failed (non-critical):', error.message);
      // Continue - let individual routes handle DB requirements
    }
    
    // Handle the request with Express app
    return app(req, res);
  } catch (error: any) {
    console.error('Error in handler:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Please check server logs',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
}

