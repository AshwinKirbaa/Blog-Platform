import React from "react";
import { Link } from "react-router-dom";
import type { Post } from "../types";
import { format } from "date-fns";
import { MessageSquare, ArrowUpRight } from "lucide-react";

interface PostCardProps {
  post: Post;
  showActions?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  showActions = false,
  onEdit,
  onDelete
}) => {
  const formattedDate = (() => {
    try {
      return format(new Date(post.createdAt), "MMM d, yyyy");
    } catch {
      return post.createdAt;
    }
  })();

  const readTimeMinutes = Math.max(1, Math.round(post.content.split(/\s+/).length / 200));

  return (
    <article className="group bg-white rounded-2xl border border-stone-200/80 p-6 sm:p-7 hover:border-stone-300 hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-stone-100 text-stone-800 font-semibold text-xs flex items-center justify-center border border-stone-200">
              {post.author?.name ? post.author.name.charAt(0).toUpperCase() : "A"}
            </div>
            <div>
              <span className="text-xs font-semibold text-stone-900 block">
                {post.author?.name || "Anonymous Author"}
              </span>
              <div className="flex items-center gap-2 text-[11px] text-stone-400">
                <time dateTime={post.createdAt}>{formattedDate}</time>
                <span>&bull;</span>
                <span>{readTimeMinutes} min read</span>
              </div>
            </div>
          </div>
        </div>

        <Link to={`/posts/${post.id}`} className="block group-hover:text-blue-600 transition-colors">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 group-hover:text-blue-600 tracking-tight leading-snug mb-2.5">
            {post.title}
          </h2>
        </Link>

        <p className="text-stone-600 text-sm leading-relaxed line-clamp-3 mb-6">
          {post.description}
        </p>
      </div>

      <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs font-medium text-stone-500">
          <div className="flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4 text-stone-400" />
            <span>{post._count?.comments ?? post.comments?.length ?? 0} comments</span>
          </div>
        </div>

        {showActions ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit && onEdit(post.id)}
              className="px-2.5 py-1 text-xs font-medium text-stone-700 hover:text-stone-900 hover:bg-stone-100 rounded-md transition-colors"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete && onDelete(post.id)}
              className="px-2.5 py-1 text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-md transition-colors"
            >
              Delete
            </button>
          </div>
        ) : (
          <Link
            to={`/posts/${post.id}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 group/link"
          >
            <span>Read Story</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
          </Link>
        )}
      </div>
    </article>
  );
};
