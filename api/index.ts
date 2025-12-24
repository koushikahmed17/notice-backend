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
      mongoose.connection.once('error', err => {
        clearTimeout(timeout);
        reject(err);
      });
    });
  }

  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error(
        'MONGODB_URI environment variable is not set. Please add it in Vercel project settings.'
      );
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
      // In production, use compiled dist folder; in development, use src
      const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL;
      const appPath = isProduction ? '../dist/app' : '../src/app';
      const appModule = await import(appPath);
      appInstance = appModule.default;
    } catch (error: any) {
      console.error('Error loading app:', error);
      // Provide more helpful error message
      if (error.message && error.message.includes('environment variables')) {
        throw new Error(
          `Configuration error: ${error.message}. Please check Vercel environment variables.`
        );
      }
      throw error;
    }
  }
  return appInstance;
};

// Vercel serverless function handler
export default async function handler(req: any, res: any) {
  try {
    // Handle health check without requiring database or app initialization
    const url = req.url || req.path || (req as any).originalUrl || '';
    const path = url.split('?')[0]; // Remove query string

    if (path === '/health' || path === '/api/health' || path.endsWith('/health')) {
      return res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString(),
      });
    }

    // For other routes, load app and connect to database
    try {
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
      console.error('Error loading app or handling request:', error);
      // If app fails to load, return error but don't crash
      const errorMessage = error.message || 'Unknown error';
      const isConfigError =
        errorMessage.includes('environment variables') || errorMessage.includes('MONGODB_URI');

      return res.status(500).json({
        success: false,
        message: isConfigError
          ? 'Configuration error: Missing required environment variables. Please check Vercel project settings.'
          : 'Internal server error',
        error:
          process.env.NODE_ENV === 'development' || process.env.VERCEL_ENV === 'preview'
            ? errorMessage
            : 'Please check server logs',
        ...(isConfigError && {
          hint: 'Make sure MONGODB_URI and other required environment variables are set in Vercel project settings.',
        }),
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      });
    }
  } catch (error: any) {
    console.error('Fatal error in handler:', error);
    // Last resort error handler
    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Please check server logs',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      });
    }
  }
}
