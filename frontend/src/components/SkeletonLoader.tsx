import React from "react";

export const SkeletonLoader: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="space-y-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm animate-pulse space-y-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-stone-200 rounded-full" />
            <div className="space-y-1.5 flex-1">
              <div className="h-3.5 bg-stone-200 rounded w-1/4" />
              <div className="h-2.5 bg-stone-100 rounded w-1/6" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-5 bg-stone-200 rounded w-3/4" />
            <div className="h-3.5 bg-stone-100 rounded w-full" />
            <div className="h-3.5 bg-stone-100 rounded w-4/5" />
          </div>
        </div>
      ))}
    </div>
  );
};
