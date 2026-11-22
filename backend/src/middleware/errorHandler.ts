import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/apiError.js";
import { config } from "../config/index.js";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // If headers already sent, delegate to default express handler
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors || null
    });
    return;
  }

  // Log unhandled server error safely without exposing raw internal details to client
  if (config.nodeEnv !== "test") {
    console.error(`[Server Error] ${new Date().toISOString()} - ${req.method} ${req.originalUrl}:`, err);
  }

  // Safe client response preventing internal stack traces and server internals leakage
  res.status(500).json({
    success: false,
    message: "An internal server error occurred. Please try again later."
  });
}
