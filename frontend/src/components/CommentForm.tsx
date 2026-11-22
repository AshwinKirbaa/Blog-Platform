import React, { useState } from "react";
import { Send } from "lucide-react";

interface CommentFormProps {
  onSubmit: (content: string) => Promise<void>;
  isSubmitting?: boolean;
}

export const CommentForm: React.FC<CommentFormProps> = ({
  onSubmit,
  isSubmitting = false
}) => {
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      setError("Please write something before publishing your comment.");
      return;
    }

    try {
      setError(null);
      await onSubmit(content.trim());
      setContent("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to post comment. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <textarea
          rows={3}
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            if (error) setError(null);
          }}
          placeholder="Share your perspective on this piece..."
          className="w-full px-4 py-3 text-sm text-stone-900 bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 placeholder:text-stone-400 resize-y transition-colors"
          maxLength={1000}
        />
        <div className="flex items-center justify-between text-xs text-stone-400 mt-1 px-1">
          <span>Constructive comments enrich the dialogue</span>
          <span>{content.length}/1000</span>
        </div>
      </div>

      {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting || !content.trim()}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none rounded-lg shadow-xs transition-colors"
        >
          <Send className="w-3.5 h-3.5" />
          <span>{isSubmitting ? "Posting..." : "Post Comment"}</span>
        </button>
      </div>
    </form>
  );
};
