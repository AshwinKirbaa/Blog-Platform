import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/apiError.js";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors || null
    });
    return;
  }

  console.error("Unhandled Server Error:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error"
  });
}
