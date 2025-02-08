import { AnyZodObject } from 'zod';
import catchAsync from '../utils/catchAsync';
import { NextFunction, Request, Response } from 'express';

const validateRequest = (scheme: AnyZodObject) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
      await scheme.parseAsync({
        body: req.body,
      });
      next();
    } catch (err) {
      next(err);
    }
  });
};

export default validateRequest;
