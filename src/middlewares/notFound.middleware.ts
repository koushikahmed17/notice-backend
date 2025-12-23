import { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS } from '../constants/httpStatus';

export const notFound = (
  req: Request,
  res: Response,
  _next: NextFunction
): Response => {
  return res.status(HTTP_STATUS.NOT_FOUND).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    statusCode: HTTP_STATUS.NOT_FOUND,
  });
};


