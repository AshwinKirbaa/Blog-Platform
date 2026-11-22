import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters").max(200, "Title cannot exceed 200 characters"),
  description: z.string().trim().min(5, "Description must be at least 5 characters").max(500, "Description cannot exceed 500 characters"),
  content: z.string().trim().min(10, "Content must be at least 10 characters")
});

export const updatePostSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters").max(200, "Title cannot exceed 200 characters").optional(),
  description: z.string().trim().min(5, "Description must be at least 5 characters").max(500, "Description cannot exceed 500 characters").optional(),
  content: z.string().trim().min(10, "Content must be at least 10 characters").optional()
}).refine(data => Object.keys(data).length > 0, {
  message: "At least one field (title, description, or content) must be provided for update"
});

export const postQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  search: z.string().trim().optional(),
  authorId: z.string().uuid().optional()
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
export type PostQueryInput = z.infer<typeof postQuerySchema>;
