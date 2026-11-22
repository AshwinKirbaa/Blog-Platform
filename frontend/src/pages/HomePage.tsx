import React, { useState, useEffect } from "react";
import { PostService } from "../services/blogService";
import type { Post, Pagination } from "../types";
import { PostCard } from "../components/PostCard";
import { FeaturedPost } from "../components/FeaturedPost";
import { SkeletonLoader } from "../components/SkeletonLoader";
import { EmptyState } from "../components/EmptyState";
import { ErrorState } from "../components/ErrorState";
import { PaginationControl } from "../components/PaginationControl";
import { Search, Sparkles, X } from "lucide-react";

export const HomePage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1); // reset to page 1 on new search
    }, 350);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await PostService.getPosts({
        page: currentPage,
        limit: 6,
        search: debouncedSearch.trim() || undefined
      });
      setPosts(res.posts);
      setPagination(res.pagination);
    } catch (err: any) {
      console.error("Failed to load posts:", err);
      setError(err.response?.data?.message || "Failed to load editorial articles.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [currentPage, debouncedSearch]);

  const featured = posts.length > 0 && !debouncedSearch && currentPage === 1 ? posts[0] : null;
  const feedPosts = featured ? posts.slice(1) : posts;

  return (
    <div className="space-y-12">
      {/* Editorial Hero Header */}
      {!debouncedSearch && currentPage === 1 && (
        <section className="text-center py-10 sm:py-16 max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-stone-100 text-stone-700 border border-stone-200">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>The Independent Journal of Craft & Technology</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-stone-900 leading-tight">
            Where ideas find their clearest voice.
          </h1>
          <p className="text-base sm:text-lg text-stone-600 max-w-xl mx-auto leading-relaxed">
            Thoughtful essays, technical deep-dives, and architectural reflections from engineers and thinkers.
          </p>
        </section>
      )}

      {/* Featured Story */}
      {featured && <FeaturedPost post={featured} />}

      {/* Search and Navigation Bar */}
      <section className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search essays, guides, or keywords..."
              className="w-full pl-10 pr-9 py-2 text-sm text-stone-900 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end text-xs text-stone-500 font-medium">
            <span>
              {pagination ? `${pagination.total} published piece${pagination.total === 1 ? "" : "s"}` : ""}
            </span>
          </div>
        </div>
      </section>

      {/* Post Grid & Status Feed */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-stone-200 pb-4">
          <h2 className="font-serif text-2xl font-bold text-stone-900">
            {debouncedSearch ? `Search Results for "${debouncedSearch}"` : "Latest Stories"}
          </h2>
        </div>

        {isLoading ? (
          <SkeletonLoader count={4} />
        ) : error ? (
          <ErrorState message={error} onRetry={fetchPosts} />
        ) : feedPosts.length === 0 && !featured ? (
          <EmptyState
            title={debouncedSearch ? "No stories matched your search" : "No stories published yet"}
            description={
              debouncedSearch
                ? "Try searching for a different keyword or view all articles."
                : "Be the first to share your thoughts, technical breakdown, or perspective."
            }
            actionText={debouncedSearch ? "Clear search" : "Write first article"}
            actionLink={debouncedSearch ? undefined : "/create"}
            onActionClick={debouncedSearch ? () => setSearchQuery("") : undefined}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {feedPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}

        {/* Pagination controls */}
        {pagination && pagination.totalPages > 1 && (
          <PaginationControl
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        )}
      </section>
    </div>
  );
};
