import { Request, Response, NextFunction } from 'express';
import { AsyncHandler } from '../types/common.types';

export const asyncHandler = (fn: AsyncHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};






