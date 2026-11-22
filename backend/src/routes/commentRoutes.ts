import { Router } from "express";
import { CommentController } from "../controllers/commentController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.delete("/:id", requireAuth, CommentController.deleteComment);

export default router;
