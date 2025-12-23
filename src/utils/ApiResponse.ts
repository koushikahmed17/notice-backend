import { Response } from 'express';
import { HTTP_STATUS } from '../constants/httpStatus';
import { ApiResponse as ApiResponseType } from '../types/common.types';

export class ApiResponse {
  static success<T>(
    res: Response,
    data?: T,
    message: string = 'Success',
    statusCode: number = HTTP_STATUS.OK
  ): Response {
    const response: ApiResponseType<T> = {
      success: true,
      message,
      data,
      statusCode,
    };
    return res.status(statusCode).json(response);
  }

  static error(
    res: Response,
    message: string = 'Error',
    statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
    error?: string
  ): Response {
    const response: ApiResponseType = {
      success: false,
      message,
      error,
      statusCode,
    };
    return res.status(statusCode).json(response);
  }
}




