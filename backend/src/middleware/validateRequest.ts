import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';

export enum ValidateRequestType {
  BODY = 'body',
  PARAMS = 'params',
}

export const validateRequest = (
  schema: AnyZodObject,
  type: ValidateRequestType = ValidateRequestType.BODY,
) => {
  return async (
    req: Request,
    _res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      req[type] = await schema.parseAsync(req[type]);
      next();
    } catch (error) {
      next(error);
    }
  };
};
