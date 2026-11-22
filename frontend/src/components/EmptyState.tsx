import React from "react";
import { FolderOpen, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  actionLink?: string;
  onActionClick?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionText,
  actionLink,
  onActionClick
}) => {
  return (
    <div className="bg-stone-50/60 border border-dashed border-stone-200 rounded-2xl p-10 text-center my-6 flex flex-col items-center max-w-lg mx-auto">
      <div className="w-12 h-12 bg-white rounded-xl shadow-xs border border-stone-200 flex items-center justify-center text-stone-400 mb-4">
        <FolderOpen className="w-6 h-6" />
      </div>
      <h3 className="font-serif text-xl font-bold text-stone-900 mb-1">{title}</h3>
      <p className="text-sm text-stone-500 mb-6 leading-relaxed max-w-sm">
        {description}
      </p>

      {actionText && actionLink && (
        <Link
          to={actionLink}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors"
        >
          <span>{actionText}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      )}

      {actionText && !actionLink && onActionClick && (
        <button
          onClick={onActionClick}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors"
        >
          <span>{actionText}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
