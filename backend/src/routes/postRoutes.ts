import { Router } from "express";
import { PostController } from "../controllers/postController.js";
import { CommentController } from "../controllers/commentController.js";
import { validateBody, validateQuery } from "../middleware/validate.js";
import { createPostSchema, updatePostSchema, postQuerySchema } from "../schemas/postSchema.js";
import { createCommentSchema } from "../schemas/commentSchema.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// Post CRUD
router.get("/", validateQuery(postQuerySchema), PostController.getPosts);
router.get("/:id", PostController.getPostById);
router.post("/", requireAuth, validateBody(createPostSchema), PostController.createPost);
router.put("/:id", requireAuth, validateBody(updatePostSchema), PostController.updatePost);
router.delete("/:id", requireAuth, PostController.deletePost);

// Comments nested under Post
router.get("/:id/comments", CommentController.getComments);
router.post("/:id/comments", requireAuth, validateBody(createCommentSchema), CommentController.createComment);

export default router;
