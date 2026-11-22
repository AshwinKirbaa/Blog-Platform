import React from "react";
import type { Comment } from "../types";
import { formatDistanceToNow } from "date-fns";
import { Trash2 } from "lucide-react";

interface CommentItemProps {
  comment: Comment;
  currentUserId?: string;
  onDelete?: (id: string) => void;
}

export const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  currentUserId,
  onDelete
}) => {
  const isOwner = currentUserId && comment.authorId === currentUserId;

  const timeAgo = (() => {
    try {
      return formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true });
    } catch {
      return comment.createdAt;
    }
  })();

  return (
    <div className="bg-white rounded-xl p-5 border border-stone-200/80 shadow-2xs space-y-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-stone-100 text-stone-700 font-semibold text-xs flex items-center justify-center border border-stone-200">
            {comment.author?.name ? comment.author.name.charAt(0).toUpperCase() : "U"}
          </div>
          <div>
            <span className="text-xs font-semibold text-stone-900">
              {comment.author?.name || "Reader"}
            </span>
            <span className="text-[11px] text-stone-400 ml-2">{timeAgo}</span>
          </div>
        </div>

        {isOwner && onDelete && (
          <button
            onClick={() => onDelete(comment.id)}
            className="text-stone-400 hover:text-rose-600 p-1 rounded-md transition-colors"
            title="Delete your comment"
            aria-label="Delete comment"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <p className="text-sm text-stone-700 leading-relaxed pl-9 whitespace-pre-wrap">
        {comment.content}
      </p>
    </div>
  );
};
