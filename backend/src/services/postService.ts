import { prisma } from "../config/db.js";
import { CreatePostInput, UpdatePostInput, PostQueryInput } from "../schemas/postSchema.js";
import { ApiError } from "../utils/apiError.js";

export class PostService {
  static async getPosts(query: PostQueryInput) {
    const { page, limit, search, authorId } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (authorId) {
      where.authorId = authorId;
    }

    if (search && search.trim() !== "") {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } }
      ];
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          author: {
            select: { id: true, name: true, email: true }
          },
          _count: {
            select: { comments: true }
          }
        }
      }),
      prisma.post.count({ where })
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    };
  }

  static async getPostById(id: string) {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: { id: true, name: true, email: true }
        },
        comments: {
          orderBy: { createdAt: "desc" },
          include: {
            author: {
              select: { id: true, name: true, email: true }
            }
          }
        }
      }
    });

    if (!post) {
      throw ApiError.notFound("Post not found");
    }

    return post;
  }

  static async createPost(authorId: string, input: CreatePostInput) {
    const post = await prisma.post.create({
      data: {
        title: input.title,
        description: input.description,
        content: input.content,
        authorId
      },
      include: {
        author: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    return post;
  }

  static async updatePost(postId: string, userId: string, input: UpdatePostInput) {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { id: true, authorId: true }
    });

    if (!post) {
      throw ApiError.notFound("Post not found");
    }

    if (post.authorId !== userId) {
      throw ApiError.forbidden("You are not authorized to update this blog post");
    }

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: input,
      include: {
        author: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    return updatedPost;
  }

  static async deletePost(postId: string, userId: string) {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { id: true, authorId: true }
    });

    if (!post) {
      throw ApiError.notFound("Post not found");
    }

    if (post.authorId !== userId) {
      throw ApiError.forbidden("You are not authorized to delete this blog post");
    }

    await prisma.post.delete({
      where: { id: postId }
    });

    return { message: "Blog post deleted successfully" };
  }
}
