import { api } from "./api";
import type { ApiResponse, AuthResponseData, User, Post, Comment, Pagination } from "../types";

export const AuthService = {
  async register(name: string, email: string, password: string): Promise<AuthResponseData> {
    const res = await api.post<ApiResponse<AuthResponseData>>("/auth/register", {
      name,
      email,
      password
    });
    return res.data.data;
  },

  async login(email: string, password: string): Promise<AuthResponseData> {
    const res = await api.post<ApiResponse<AuthResponseData>>("/auth/login", {
      email,
      password
    });
    return res.data.data;
  },

  async getMe(): Promise<User> {
    const res = await api.get<ApiResponse<User>>("/auth/me");
    return res.data.data;
  }
};

export const PostService = {
  async getPosts(params?: { page?: number; limit?: number; search?: string; authorId?: string }): Promise<{ posts: Post[]; pagination: Pagination }> {
    const res = await api.get<ApiResponse<Post[]>>("/posts", { params });
    return {
      posts: res.data.data,
      pagination: res.data.pagination!
    };
  },

  async getPostById(id: string): Promise<Post> {
    const res = await api.get<ApiResponse<Post>>(`/posts/${id}`);
    return res.data.data;
  },

  async createPost(data: { title: string; description: string; content: string }): Promise<Post> {
    const res = await api.post<ApiResponse<Post>>("/posts", data);
    return res.data.data;
  },

  async updatePost(id: string, data: { title?: string; description?: string; content?: string }): Promise<Post> {
    const res = await api.put<ApiResponse<Post>>(`/posts/${id}`, data);
    return res.data.data;
  },

  async deletePost(id: string): Promise<void> {
    await api.delete<ApiResponse<{ message: string }>>(`/posts/${id}`);
  }
};

export const CommentService = {
  async getComments(postId: string): Promise<Comment[]> {
    const res = await api.get<ApiResponse<Comment[]>>(`/posts/${postId}/comments`);
    return res.data.data;
  },

  async createComment(postId: string, content: string): Promise<Comment> {
    const res = await api.post<ApiResponse<Comment>>(`/posts/${postId}/comments`, { content });
    return res.data.data;
  },

  async deleteComment(commentId: string): Promise<void> {
    await api.delete<ApiResponse<{ message: string }>>(`/comments/${commentId}`);
  }
};
