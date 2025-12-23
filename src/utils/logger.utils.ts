import logger from '../config/logger';

export const logError = (error: Error, context?: string): void => {
  logger.error({
    message: error.message,
    stack: error.stack,
    context,
  });
};

export const logInfo = (message: string, meta?: Record<string, any>): void => {
  logger.info(message, meta);
};

export const logWarn = (message: string, meta?: Record<string, any>): void => {
  logger.warn(message, meta);
};




