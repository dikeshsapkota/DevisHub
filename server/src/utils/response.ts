import { Response } from 'express';

const getErrorMessage = (error: unknown): string => {
  if (typeof error === 'string' && error.trim()) return error;

  if (Array.isArray(error)) {
    const firstMessage = error.map(getErrorMessage).find((message) => message !== 'An unexpected error occurred');
    if (firstMessage) return firstMessage;
  }

  if (typeof error === 'object' && error !== null) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === 'string' && message.trim()) return message;
    if (message) return getErrorMessage(message);

    const issues = (error as { issues?: unknown }).issues;
    if (issues) return getErrorMessage(issues);

    const fieldErrors = (error as { fieldErrors?: Record<string, unknown> }).fieldErrors;
    if (fieldErrors) {
      const firstFieldError = Object.values(fieldErrors).flat().find(Boolean);
      if (firstFieldError) return getErrorMessage(firstFieldError);
    }
  }

  return 'An unexpected error occurred';
};

export const sendSuccess = (res: Response, data: any, message?: string, statusCode = 200, pagination?: any) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    pagination,
  });
};

export const sendError = (res: Response, error: unknown, statusCode = 400) => {
  return res.status(statusCode).json({
    success: false,
    error: getErrorMessage(error),
  });
};
