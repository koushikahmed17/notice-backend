import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { HTTP_STATUS } from '../constants/httpStatus';

export const validate =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((err) => ({
          path: err.path.join('.'),
          message: err.message,
        }));
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: 'Validation error',
          errors: errorMessages,
          statusCode: HTTP_STATUS.BAD_REQUEST,
        });
        return;
      }
      next(error);
    }
  };


