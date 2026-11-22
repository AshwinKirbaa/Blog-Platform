import { Request, Response, NextFunction } from "express";
import { PostService } from "../services/postService.js";

export class PostController {
  static async getPosts(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await PostService.getPosts(req.query as any);
      res.status(200).json({
        success: true,
        data: result.posts,
        pagination: result.pagination
      });
    } catch (error) {
      next(error);
    }
  }

  static async getPostById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const post = await PostService.getPostById(id);
      res.status(200).json({
        success: true,
        data: post
      });
    } catch (error) {
      next(error);
    }
  }

  static async createPost(req: Request, res: Response, next: NextFunction) {
    try {
      const post = await PostService.createPost(req.user!.id, req.body);
      res.status(201).json({
        success: true,
        message: "Post created successfully",
        data: post
      });
    } catch (error) {
      next(error);
    }
  }

  static async updatePost(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const updatedPost = await PostService.updatePost(id, req.user!.id, req.body);
      res.status(200).json({
        success: true,
        message: "Post updated successfully",
        data: updatedPost
      });
    } catch (error) {
      next(error);
    }
  }

  static async deletePost(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const result = await PostService.deletePost(id, req.user!.id);
      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      next(error);
    }
  }
}
