import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Feather, LogIn, UserPlus, LayoutDashboard, PenSquare, LogOut, Menu, X } from "lucide-react";

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate("/");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Brand Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 text-stone-900 group transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-stone-900 text-stone-50 flex items-center justify-center shadow-sm group-hover:bg-blue-600 transition-colors">
              <Feather className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-bold tracking-tight text-stone-900">
                Chronicle
              </span>
              <span className="text-[10px] uppercase tracking-widest text-stone-500 font-medium">
                Editorial Journal
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors ${
                isActive("/") ? "text-blue-600 font-semibold" : "text-stone-600 hover:text-stone-900"
              }`}
            >
              Explore
            </Link>

            {user ? (
              <>
                <Link
                  to="/create"
                  className="flex items-center gap-1.5 text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors"
                >
                  <PenSquare className="w-4 h-4 text-stone-500" />
                  <span>Write</span>
                </Link>
                <Link
                  to="/dashboard"
                  className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                    isActive("/dashboard") ? "text-blue-600 font-semibold" : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>

                <div className="h-5 w-px bg-stone-200" />

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-semibold text-xs flex items-center justify-center border border-blue-200">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-stone-800 max-w-[120px] truncate">
                      {user.name}
                    </span>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-stone-100 transition-colors"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-stone-700 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Get Started</span>
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile menu trigger */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-stone-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-stone-800 hover:text-blue-600"
          >
            Explore
          </Link>

          {user ? (
            <>
              <Link
                to="/create"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 py-2 text-base font-medium text-stone-800 hover:text-blue-600"
              >
                <PenSquare className="w-5 h-5" />
                <span>Write New Story</span>
              </Link>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 py-2 text-base font-medium text-stone-800 hover:text-blue-600"
              >
                <LayoutDashboard className="w-5 h-5" />
                <span>Dashboard ({user.name})</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full py-2 text-base font-medium text-rose-600 text-left"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </>
          ) : (
            <div className="pt-2 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-medium text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-lg text-center"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg text-center shadow-sm"
              >
                <UserPlus className="w-4 h-4" />
                <span>Create Free Account</span>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
