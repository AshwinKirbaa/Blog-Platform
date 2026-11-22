export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    posts: number;
    comments: number;
  };
}

export interface Author {
  id: string;
  name: string;
  email: string;
}

export interface Comment {
  id: string;
  content: string;
  postId: string;
  authorId: string;
  author: Author;
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  id: string;
  title: string;
  description: string;
  content: string;
  authorId: string;
  author: Author;
  createdAt: string;
  updatedAt: string;
  comments?: Comment[];
  _count?: {
    comments: number;
  };
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
  pagination?: Pagination;
  errors?: Array<{ field: string; message: string }>;
}

export interface AuthResponseData {
  user: User;
  token: string;
}
