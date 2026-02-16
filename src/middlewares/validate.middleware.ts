import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import { BadRequestError } from '../utils/errors';

export const validate = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const messages = error.issues.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        next(new BadRequestError(JSON.stringify(messages)));
      } else {
        next(error);
      }
    }
  };
};