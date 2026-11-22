import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PostService } from "../services/blogService";
import { ArrowLeft, Send, AlertCircle } from "lucide-react";

export const CreateBlogPage: React.FC = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (title.trim().length < 3) {
      setErrorMessage("Title must be at least 3 characters long.");
      return;
    }
    if (description.trim().length < 5) {
      setErrorMessage("Description must be at least 5 characters long.");
      return;
    }
    if (content.trim().length < 10) {
      setErrorMessage("Story content must be at least 10 characters long.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      const newPost = await PostService.createPost({
        title: title.trim(),
        description: description.trim(),
        content: content.trim()
      });
      navigate(`/posts/${newPost.id}`);
    } catch (err: any) {
      console.error("Failed to publish post:", err);
      const backendError =
        err.response?.data?.errors?.[0]?.message ||
        err.response?.data?.message ||
        "Failed to publish story. Please verify all inputs.";
      setErrorMessage(backendError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 sm:py-12 space-y-8">
      <div className="flex items-center justify-between border-b border-stone-200 pb-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-semibold text-stone-500 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Cancel & Back</span>
        </button>
        <span className="text-xs font-medium text-stone-400">Chronicle Editorial Studio</span>
      </div>

      <div className="space-y-2">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
          Write a New Story
        </h1>
        <p className="text-stone-500 text-sm">
          Craft thoughtful prose, articulate architecture insights, or share a story with your readers.
        </p>
      </div>

      {errorMessage && (
        <div className="flex items-center gap-2.5 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
            Story Title
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Modern Web Architecture Patterns for Scalable Systems"
            className="w-full px-4 py-3 text-lg font-serif font-bold text-stone-900 bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 placeholder:text-stone-300 placeholder:font-sans transition-colors"
            maxLength={200}
          />
          <div className="flex justify-between text-[11px] text-stone-400">
            <span>A compelling, concise title for your article</span>
            <span>{title.length}/200</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
            Summary / Excerpt
          </label>
          <textarea
            rows={2}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="A brief 1-2 sentence overview shown in feeds, previews, and meta summaries..."
            className="w-full px-4 py-2.5 text-sm text-stone-800 bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 placeholder:text-stone-400 resize-y transition-colors"
            maxLength={500}
          />
          <div className="flex justify-between text-[11px] text-stone-400">
            <span>Displayed on article preview cards</span>
            <span>{description.length}/500</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
              Article Content
            </label>
            <span className="text-[11px] text-stone-400 font-medium">
              Supports clean prose and line breaks
            </span>
          </div>
          <textarea
            rows={14}
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start drafting your article here... Dive deep into details, considerations, trade-offs, and conclusions."
            className="w-full px-4 py-3.5 text-base font-serif text-stone-900 bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 placeholder:text-stone-400 placeholder:font-sans resize-y leading-relaxed transition-colors"
          />
          <div className="flex justify-between text-[11px] text-stone-400">
            <span>Word count: {content.trim() ? content.trim().split(/\s+/).length : 0}</span>
            <span>{content.length} characters</span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
          <button
            type="button"
            onClick={() => navigate(-1)}
            disabled={isSubmitting}
            className="px-5 py-2.5 text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl shadow-xs transition-colors"
          >
            <Send className="w-4 h-4" />
            <span>{isSubmitting ? "Publishing Story..." : "Publish Story"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
