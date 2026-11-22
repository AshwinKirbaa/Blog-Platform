import { Request, Response, NextFunction } from "express";
import { verifyToken, JwtPayload } from "../utils/auth.js";
import { ApiError } from "../utils/apiError.js";
import { prisma } from "../config/db.js";

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw ApiError.unauthorized("Authentication token required");
    }

    const token = authHeader.split(" ")[1];
    let payload: JwtPayload;

    try {
      payload = verifyToken(token);
    } catch (err) {
      throw ApiError.unauthorized("Invalid or expired authentication token");
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, name: true, email: true }
    });

    if (!user) {
      throw ApiError.unauthorized("User account no longer exists");
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}
