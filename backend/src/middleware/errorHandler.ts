import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { CustomError } from '../errors/CustomError';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  _next: NextFunction,
): void => {
  if (err instanceof ZodError) {
    res.status(400).json({
      status: 'error',
      message: 'Request validation error',
      errors: err.errors,
    });
    return;
  }

  if (err instanceof CustomError) {
    res.status(err.status).json({
      status: 'error',
      message: err.message,
    });
    return;
  }

  res.status(500).json({
    status: 'error',
    message: 'Failed to process request',
  });
};
