import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { PostService, AuthService } from "../services/blogService";
import type { Post, User } from "../types";
import { PostCard } from "../components/PostCard";
import { SkeletonLoader } from "../components/SkeletonLoader";
import { EmptyState } from "../components/EmptyState";
import { ConfirmDeleteModal } from "../components/ConfirmDeleteModal";
import { PenSquare, BookOpen, MessageSquare, UserCheck, Calendar } from "lucide-react";
import { format } from "date-fns";

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<User | null>(null);
  const [myPosts, setMyPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const [profileData, postsData] = await Promise.all([
        AuthService.getMe(),
        user ? PostService.getPosts({ authorId: user.id, limit: 50 }) : Promise.resolve({ posts: [] })
      ]);
      setProfile(profileData);
      setMyPosts(postsData.posts);
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const handleConfirmDelete = async () => {
    if (!postToDelete) return;
    try {
      setIsDeleting(true);
      await PostService.deletePost(postToDelete);
      setMyPosts((prev) => prev.filter((p) => p.id !== postToDelete));
      setPostToDelete(null);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete post.");
    } finally {
      setIsDeleting(false);
    }
  };

  const memberSince = (() => {
    try {
      return profile?.createdAt ? format(new Date(profile.createdAt), "MMMM yyyy") : "";
    } catch {
      return "";
    }
  })();

  return (
    <div className="space-y-10 py-6 sm:py-8">
      {/* Profile Overview Header */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white font-serif font-bold text-2xl flex items-center justify-center shadow-xs">
              {profile?.name ? profile.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-2xl font-bold text-stone-900">
                  {profile?.name || user?.name}
                </h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <UserCheck className="w-3 h-3" /> Author
                </span>
              </div>
              <p className="text-sm text-stone-500">{profile?.email || user?.email}</p>
              {memberSince && (
                <p className="text-xs text-stone-400 mt-1">Writer since {memberSince}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/create"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-stone-900 text-white text-sm font-semibold hover:bg-stone-800 transition-colors shadow-xs"
            >
              <PenSquare className="w-4 h-4" />
              <span>Write Story</span>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-stone-100">
          <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/60">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span>Published Stories</span>
            </div>
            <p className="font-serif text-2xl font-bold text-stone-900">
              {profile?._count?.posts ?? myPosts.length}
            </p>
          </div>

          <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/60">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <span>Comments Posted</span>
            </div>
            <p className="font-serif text-2xl font-bold text-stone-900">
              {profile?._count?.comments ?? 0}
            </p>
          </div>

          <div className="col-span-2 sm:col-span-1 bg-stone-50 rounded-2xl p-4 border border-stone-200/60">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
              <Calendar className="w-4 h-4 text-purple-600" />
              <span>Account Status</span>
            </div>
            <p className="text-sm font-semibold text-emerald-600 mt-1">Active & Verified</p>
          </div>
        </div>
      </section>

      {/* Published Stories Management */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-stone-200 pb-4">
          <div>
            <h2 className="font-serif text-2xl font-bold text-stone-900">My Stories</h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Manage, edit, or delete your published editorial articles
            </p>
          </div>
        </div>

        {isLoading ? (
          <SkeletonLoader count={3} />
        ) : myPosts.length === 0 ? (
          <EmptyState
            title="You haven't written any stories yet"
            description="Your author dashboard is empty. Publish your first piece and share your perspectives with the community."
            actionText="Write First Story"
            actionLink="/create"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                showActions={true}
                onEdit={(id) => navigate(`/edit/${id}`)}
                onDelete={(id) => setPostToDelete(id)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={!!postToDelete}
        title="Delete Story"
        message="Are you sure you want to permanently delete this story? This will permanently remove the story and any reader comments."
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setPostToDelete(null)}
      />
    </div>
  );
};
