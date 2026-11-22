import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { PostService, CommentService } from "../services/blogService";
import type { Post, Comment } from "../types";
import { useAuth } from "../context/AuthContext";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ErrorState } from "../components/ErrorState";
import { CommentItem } from "../components/CommentItem";
import { CommentForm } from "../components/CommentForm";
import { ConfirmDeleteModal } from "../components/ConfirmDeleteModal";
import { format } from "date-fns";
import {
  ArrowLeft,
  Edit,
  Trash2,
  MessageSquare,
  Share2,
  Check
} from "lucide-react";

export const BlogDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Deletion modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeletingPost, setIsDeletingPost] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);

  // Link copied feedback
  const [copied, setCopied] = useState(false);

  const fetchPostAndComments = async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      setError(null);
      const postData = await PostService.getPostById(id);
      setPost(postData);

      // Comments are included in getPostById, but fetch fresh comments too
      const commentsData = await CommentService.getComments(id);
      setComments(commentsData);
    } catch (err: any) {
      console.error("Failed to load post details:", err);
      setError(err.response?.data?.message || "This story could not be found.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPostAndComments();
  }, [id]);

  const isAuthor = user && post && user.id === post.authorId;

  const handlePostDelete = async () => {
    if (!post) return;
    try {
      setIsDeletingPost(true);
      await PostService.deletePost(post.id);
      navigate("/dashboard");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete post.");
      setIsDeletingPost(false);
    }
  };

  const handleAddComment = async (content: string) => {
    if (!post) return;
    const newComment = await CommentService.createComment(post.id, content);
    setComments((prev) => [newComment, ...prev]);
  };

  const handleCommentDelete = async () => {
    if (!commentToDelete) return;
    try {
      await CommentService.deleteComment(commentToDelete);
      setComments((prev) => prev.filter((c) => c.id !== commentToDelete));
      setCommentToDelete(null);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete comment.");
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="py-20">
        <LoadingSpinner text="Loading story..." size="lg" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="py-16 max-w-lg mx-auto">
        <ErrorState
          title="Story Not Found"
          message={error || "The requested article does not exist or has been removed."}
          onRetry={fetchPostAndComments}
        />
        <div className="text-center mt-4">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to stories</span>
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate = (() => {
    try {
      return format(new Date(post.createdAt), "MMMM d, yyyy");
    } catch {
      return post.createdAt;
    }
  })();

  const readTimeMinutes = Math.max(1, Math.round(post.content.split(/\s+/).length / 200));

  return (
    <div className="max-w-3xl mx-auto py-6 sm:py-10 space-y-12">
      {/* Top back navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-stone-500 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>All Stories</span>
        </Link>

        {/* Author Actions */}
        {isAuthor && (
          <div className="flex items-center gap-2">
            <Link
              to={`/edit/${post.id}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Edit</span>
            </Link>
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>

      {/* Article Header */}
      <header className="space-y-6">
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-stone-900 leading-tight">
          {post.title}
        </h1>

        <p className="text-lg sm:text-xl text-stone-600 leading-relaxed font-sans">
          {post.description}
        </p>

        {/* Author Byline */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-5 border-y border-stone-200">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-blue-100 text-blue-800 font-bold text-sm flex items-center justify-center border border-blue-200">
              {post.author?.name ? post.author.name.charAt(0).toUpperCase() : "A"}
            </div>
            <div>
              <p className="text-sm font-semibold text-stone-900">
                {post.author?.name || "Editorial Writer"}
              </p>
              <div className="flex items-center gap-2 text-xs text-stone-400">
                <time dateTime={post.createdAt}>{formattedDate}</time>
                <span>&bull;</span>
                <span>{readTimeMinutes} min read</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
              title="Copy story link"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied!" : "Share"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Body Content */}
      <main className="prose prose-stone max-w-none">
        <div className="font-serif text-lg sm:text-xl text-stone-800 leading-relaxed space-y-6 whitespace-pre-wrap">
          {post.content}
        </div>
      </main>

      {/* Comments Section */}
      <section className="pt-12 border-t border-stone-200 space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-stone-700" />
            <h2 className="font-serif text-2xl font-bold text-stone-900">
              Responses ({comments.length})
            </h2>
          </div>
        </div>

        {/* Add Comment Form or Login Prompt */}
        {user ? (
          <div className="bg-stone-50/80 rounded-2xl p-6 border border-stone-200">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-3">
              Add to the discussion as <span className="text-stone-900">{user.name}</span>
            </h3>
            <CommentForm onSubmit={handleAddComment} />
          </div>
        ) : (
          <div className="bg-stone-50 rounded-2xl p-6 border border-dashed border-stone-300 text-center space-y-3">
            <p className="text-sm text-stone-600">
              Sign in to share your thoughts, ask questions, or contribute to this story.
            </p>
            <div className="flex justify-center gap-3">
              <Link
                to="/login"
                className="px-4 py-2 text-xs font-semibold text-stone-800 bg-white border border-stone-300 hover:bg-stone-100 rounded-lg shadow-2xs transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-2xs transition-colors"
              >
                Create Account
              </Link>
            </div>
          </div>
        )}

        {/* Comments List */}
        <div className="space-y-4">
          {comments.length === 0 ? (
            <div className="text-center py-10 text-stone-400 text-sm">
              No responses yet. Be the first to start the conversation!
            </div>
          ) : (
            comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                currentUserId={user?.id}
                onDelete={(commentId) => setCommentToDelete(commentId)}
              />
            ))
          )}
        </div>
      </section>

      {/* Delete Post Modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        title="Delete Story"
        message="Are you sure you want to permanently delete this story? All associated comments and readership feedback will also be removed. This action cannot be undone."
        isDeleting={isDeletingPost}
        onConfirm={handlePostDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />

      {/* Delete Comment Modal */}
      <ConfirmDeleteModal
        isOpen={!!commentToDelete}
        title="Delete Comment"
        message="Are you sure you want to delete your comment? This cannot be undone."
        onConfirm={handleCommentDelete}
        onCancel={() => setCommentToDelete(null)}
      />
    </div>
  );
};
