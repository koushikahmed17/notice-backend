import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import connectDatabase from './config/database';
import env from './config/environment';
import logger from './config/logger';
import routes from './routes';
import { Router } from 'express';

// Create Express app instance for initOnce
const app = express();

// Initialize flag
let initialized = false;

// Create public routes router (empty for now, can be extended later)
const publicRoutes = Router();

export async function initOnce() {
  if (initialized) return;

  logger.info('🔌 Initializing database connection...');

  await connectDatabase();

  logger.info('✅ Database connection established');

  app.use(helmet());

  const corsOptions = {
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
      'Cache-Control',
      'Pragma',
      'X-Clinic-Id',
    ],
    credentials: true,
    optionsSuccessStatus: 200,
  };

  app.use(cors(corsOptions));
  app.options('*', cors(corsOptions));

  app.use((_req, res, next) => {
    if (process.env.NODE_ENV === 'development') {
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header('Access-Control-Max-Age', '3600');
    }
    next();
  });

  app.use(
    '/api',
    rateLimit({
      windowMs: 60 * 1000,
      max: 10000,
      message: {
        success: false,
        message: 'Too many requests from this IP, please try again later.',
      },
    })
  );

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Swagger documentation - commented out as swagger is not installed
  // app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, {
  //   explorer: true,
  //   customCss: '.swagger-ui .topbar { display: none }',
  //   customSiteTitle: 'Clinic Management API Documentation',
  //   swaggerOptions: {
  //     docExpansion: 'none',
  //     filter: true,
  //     showRequestDuration: true,
  //     syntaxHighlight: { activate: true, theme: 'agate' }
  //   }
  // }));

  app.use('/public', publicRoutes);
  app.use('/api', routes);

  app.get('/api/health', (_req, res) => {
    res.json({
      success: true,
      message: 'Clinic Management System API is running',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
    });
  });

  app.get('/', (_req, res) => {
    res.json({
      success: true,
      message: 'Clinic Management System API',
      version: '1.0.0',
      documentation: '/api/docs',
      health: '/api/health',
      databaseHealth: '/api/health/database',
    });
  });

  app.use('*', (_req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
  });

  app.use(
    (
      err: unknown,
      _req: express.Request,
      res: express.Response,
      _next: express.NextFunction
    ): express.Response => {
      logger.error('Error:', err);

      if (err && typeof err === 'object' && 'name' in err) {
        if (
          err.name === 'ValidationError' &&
          'errors' in err &&
          err.errors &&
          typeof err.errors === 'object'
        ) {
          const errors = Object.values(err.errors).map((e: unknown) =>
            e && typeof e === 'object' && 'message' in e ? String(e.message) : 'Validation error'
          );
          return res.status(400).json({ success: false, message: 'Validation Error', errors });
        }

        if (err.name === 'CastError') {
          return res.status(400).json({ success: false, message: 'Invalid ID format' });
        }

        if (err.name === 'JsonWebTokenError') {
          return res.status(401).json({ success: false, message: 'Invalid token' });
        }

        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({ success: false, message: 'Token expired' });
        }

        if (err.name === 'MongoNetworkError' || err.name === 'MongoTimeoutError') {
          return res.status(503).json({ success: false, message: 'Database connection error' });
        }
      }

      const status =
        err && typeof err === 'object' && 'status' in err && typeof err.status === 'number'
          ? err.status
          : 500;
      const message =
        err && typeof err === 'object' && 'message' in err && typeof err.message === 'string'
          ? err.message
          : 'Internal server error';

      return res.status(status).json({ success: false, message });
    }
  );

  initialized = true;
}

const startServer = async (): Promise<void> => {
  try {
    // Initialize middleware and database connection
    await initOnce();

    // Start server
    const server = app.listen(env.PORT, () => {
      logger.info(`🚀 Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
    });

    // Graceful shutdown
    const gracefulShutdown = (signal: string) => {
      logger.info(`${signal} received. Shutting down gracefully...`);
      server.close(() => {
        logger.info('Process terminated');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Only start server if not in serverless/vercel environment
if (require.main === module) {
  startServer();
}

export default app;
