import { Router } from "express";
import { AuthController } from "../controllers/authController.js";
import { validateBody } from "../middleware/validate.js";
import { registerSchema, loginSchema } from "../schemas/authSchema.js";
import { requireAuth } from "../middleware/auth.js";
import { authRateLimiter } from "../middleware/rateLimiter.js";

const router = Router();

router.post("/register", authRateLimiter, validateBody(registerSchema), AuthController.register);
router.post("/login", authRateLimiter, validateBody(loginSchema), AuthController.login);
router.get("/me", requireAuth, AuthController.getMe);

export default router;
