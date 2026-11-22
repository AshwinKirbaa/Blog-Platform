import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PostService } from "../services/blogService";
import { useAuth } from "../context/AuthContext";
import { ArrowLeft, Save, AlertCircle } from "lucide-react";
import { LoadingSpinner } from "../components/LoadingSpinner";

export const EditBlogPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        setErrorMessage(null);
        const post = await PostService.getPostById(id);

        // Security check: only author can edit
        if (user && post.authorId !== user.id) {
          setErrorMessage("You do not have permission to edit this story.");
          return;
        }

        setTitle(post.title);
        setDescription(post.description);
        setContent(post.content);
      } catch (err: any) {
        console.error("Failed to load post for editing:", err);
        setErrorMessage(err.response?.data?.message || "Failed to load post.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

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
      await PostService.updatePost(id, {
        title: title.trim(),
        description: description.trim(),
        content: content.trim()
      });
      navigate(`/posts/${id}`);
    } catch (err: any) {
      console.error("Failed to update post:", err);
      const backendError =
        err.response?.data?.errors?.[0]?.message ||
        err.response?.data?.message ||
        "Failed to update story. Please verify your inputs.";
      setErrorMessage(backendError);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-20">
        <LoadingSpinner text="Loading story for editing..." size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 sm:py-12 space-y-8">
      <div className="flex items-center justify-between border-b border-stone-200 pb-4">
        <button
          type="button"
          onClick={() => navigate(`/posts/${id}`)}
          className="inline-flex items-center gap-2 text-xs font-semibold text-stone-500 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Discard & Back to Story</span>
        </button>
        <span className="text-xs font-medium text-stone-400">Editing Story</span>
      </div>

      <div className="space-y-2">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
          Edit Story
        </h1>
        <p className="text-stone-500 text-sm">
          Update the title, summary, or content of your published piece.
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
            className="w-full px-4 py-3 text-lg font-serif font-bold text-stone-900 bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors"
            maxLength={200}
          />
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
            className="w-full px-4 py-2.5 text-sm text-stone-800 bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 resize-y transition-colors"
            maxLength={500}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
            Article Content
          </label>
          <textarea
            rows={14}
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-4 py-3.5 text-base font-serif text-stone-900 bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 resize-y leading-relaxed transition-colors"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
          <button
            type="button"
            onClick={() => navigate(`/posts/${id}`)}
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
            <Save className="w-4 h-4" />
            <span>{isSubmitting ? "Saving Changes..." : "Save Changes"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
