import { prisma } from "../config/db.js";
import { CreateCommentInput } from "../schemas/commentSchema.js";
import { ApiError } from "../utils/apiError.js";

export class CommentService {
  static async getCommentsByPostId(postId: string) {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { id: true }
    });

    if (!post) {
      throw ApiError.notFound("Post not found");
    }

    const comments = await prisma.comment.findMany({
      where: { postId },
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    return comments;
  }

  static async createComment(postId: string, authorId: string, input: CreateCommentInput) {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { id: true }
    });

    if (!post) {
      throw ApiError.notFound("Cannot comment on non-existent post");
    }

    const comment = await prisma.comment.create({
      data: {
        content: input.content,
        postId,
        authorId
      },
      include: {
        author: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    return comment;
  }

  static async deleteComment(commentId: string, userId: string) {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { id: true, authorId: true }
    });

    if (!comment) {
      throw ApiError.notFound("Comment not found");
    }

    if (comment.authorId !== userId) {
      throw ApiError.forbidden("You are not authorized to delete this comment");
    }

    await prisma.comment.delete({
      where: { id: commentId }
    });

    return { message: "Comment deleted successfully" };
  }
}
