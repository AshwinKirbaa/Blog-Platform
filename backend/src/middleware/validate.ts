import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { ApiError } from "../utils/apiError.js";

export function validateBody(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorDetails = error.errors.map(err => ({
          field: err.path.join("."),
          message: err.message
        }));
        next(ApiError.badRequest("Validation failed", errorDetails));
      } else {
        next(error);
      }
    }
  };
}

export function validateQuery(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.query = schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorDetails = error.errors.map(err => ({
          field: err.path.join("."),
          message: err.message
        }));
        next(ApiError.badRequest("Invalid query parameters", errorDetails));
      } else {
        next(error);
      }
    }
  };
}
