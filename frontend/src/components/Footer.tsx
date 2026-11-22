import React from "react";
import { Link } from "react-router-dom";
import { Feather } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-50 border-t border-stone-200 py-12 text-stone-600">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-stone-900 text-white flex items-center justify-center">
              <Feather className="w-4 h-4" />
            </div>
            <div>
              <span className="font-serif font-bold text-lg text-stone-900 tracking-tight">
                Chronicle
              </span>
              <p className="text-xs text-stone-500">
                A refined space for deep ideas, essays, and stories.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm">
            <Link to="/" className="hover:text-stone-900 transition-colors">
              Explore
            </Link>
            <Link to="/login" className="hover:text-stone-900 transition-colors">
              Sign In
            </Link>
            <Link to="/register" className="hover:text-stone-900 transition-colors">
              Join
            </Link>
          </div>

          <div className="text-xs text-stone-400 text-center md:text-right">
            &copy; {new Date().getFullYear()} Chronicle Publishing. Built with full-stack integrity.
          </div>
        </div>
      </div>
    </footer>
  );
};
