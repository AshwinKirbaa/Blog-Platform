import { Request, Response, NextFunction } from "express";
import { CommentService } from "../services/commentService.js";

export class CommentController {
  static async getComments(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const comments = await CommentService.getCommentsByPostId(id);
      res.status(200).json({
        success: true,
        data: comments
      });
    } catch (error) {
      next(error);
    }
  }

  static async createComment(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const comment = await CommentService.createComment(id, req.user!.id, req.body);
      res.status(201).json({
        success: true,
        message: "Comment added successfully",
        data: comment
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteComment(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const result = await CommentService.deleteComment(id, req.user!.id);
      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      next(error);
    }
  }
}
