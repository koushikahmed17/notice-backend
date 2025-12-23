import { Request, Response } from 'express';
import app from '../src/app';
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
      mongoose.connection.once('connected', resolve);
      mongoose.connection.once('error', reject);
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

// Vercel serverless function handler
export default async function handler(req: Request, res: Response) {
  // Initialize database if not already connected
  try {
    await connectDatabase();
  } catch (error: any) {
    console.error('Database connection failed:', error);
    return res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Please check server logs',
    });
  }
  
  // Handle the request with Express app
  return app(req, res);
}

