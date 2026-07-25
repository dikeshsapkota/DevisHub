import { Response } from 'express';

export const sendSuccess = (res: Response, data: any, message?: string, statusCode = 200, pagination?: any) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    pagination,
  });
};

export const sendError = (res: Response, error: string, statusCode = 400) => {
  return res.status(statusCode).json({
    success: false,
    error,
  });
};
