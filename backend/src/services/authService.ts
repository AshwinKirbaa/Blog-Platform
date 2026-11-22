import { prisma } from "../config/db.js";
import { RegisterInput, LoginInput } from "../schemas/authSchema.js";
import { hashPassword, comparePassword, generateToken } from "../utils/auth.js";
import { ApiError } from "../utils/apiError.js";

export class AuthService {
  static async register(input: RegisterInput) {
    const existingUser = await prisma.user.findUnique({
      where: { email: input.email }
    });

    if (existingUser) {
      throw ApiError.conflict("An account with this email address already exists");
    }

    const hashedPassword = await hashPassword(input.password);

    const user = await prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        password: hashedPassword
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true
      }
    });

    const token = generateToken({ userId: user.id, email: user.email });

    return { user, token };
  }

  static async login(input: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { email: input.email }
    });

    if (!user) {
      throw ApiError.unauthorized("Invalid email or password");
    }

    const isMatch = await comparePassword(input.password, user.password);
    if (!isMatch) {
      throw ApiError.unauthorized("Invalid email or password");
    }

    const token = generateToken({ userId: user.id, email: user.email });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      token
    };
  }

  static async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            posts: true,
            comments: true
          }
        }
      }
    });

    if (!user) {
      throw ApiError.notFound("User not found");
    }

    return user;
  }
}
