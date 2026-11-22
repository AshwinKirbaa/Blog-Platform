import React from "react";
import { Link } from "react-router-dom";
import type { Post } from "../types";
import { format } from "date-fns";
import { Sparkles, ArrowRight, MessageSquare } from "lucide-react";

export const FeaturedPost: React.FC<{ post: Post }> = ({ post }) => {
  const formattedDate = (() => {
    try {
      return format(new Date(post.createdAt), "MMMM d, yyyy");
    } catch {
      return post.createdAt;
    }
  })();

  const readTimeMinutes = Math.max(1, Math.round(post.content.split(/\s+/).length / 200));

  return (
    <div className="relative overflow-hidden rounded-3xl bg-stone-900 text-stone-100 p-8 sm:p-10 lg:p-12 shadow-xl mb-12">
      <div className="flex items-center gap-2 mb-6">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30">
          <Sparkles className="w-3.5 h-3.5" />
          Featured Editorial
        </span>
        <span className="text-xs text-stone-400">{readTimeMinutes} min read</span>
      </div>

      <div className="max-w-3xl">
        <Link to={`/posts/${post.id}`}>
          <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white hover:text-blue-300 transition-colors leading-tight mb-4">
            {post.title}
          </h1>
        </Link>
        <p className="text-stone-300 text-base sm:text-lg leading-relaxed line-clamp-3 mb-8">
          {post.description}
        </p>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-semibold text-sm flex items-center justify-center">
              {post.author?.name ? post.author.name.charAt(0).toUpperCase() : "A"}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{post.author?.name || "Author"}</p>
              <p className="text-xs text-stone-400">{formattedDate}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-xs text-stone-400">
              <MessageSquare className="w-4 h-4" />
              <span>{post._count?.comments ?? post.comments?.length ?? 0}</span>
            </div>
            <Link
              to={`/posts/${post.id}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-stone-900 font-semibold text-sm hover:bg-stone-100 transition-colors shadow-sm"
            >
              <span>Read Full Piece</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
