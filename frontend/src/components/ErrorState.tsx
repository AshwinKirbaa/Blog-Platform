import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Something went wrong",
  message,
  onRetry
}) => {
  return (
    <div className="bg-rose-50/60 border border-rose-200 rounded-2xl p-8 text-center my-6 max-w-md mx-auto">
      <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center mx-auto mb-3">
        <AlertTriangle className="w-5 h-5" />
      </div>
      <h3 className="font-serif text-lg font-bold text-rose-950 mb-1">{title}</h3>
      <p className="text-sm text-rose-700 mb-5 leading-relaxed">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-rose-800 bg-rose-100 hover:bg-rose-200 rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Try again</span>
        </button>
      )}
    </div>
  );
};
