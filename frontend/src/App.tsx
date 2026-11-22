import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { ProtectedRoute } from "./components/ProtectedRoute";

// Pages
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { BlogDetailsPage } from "./pages/BlogDetailsPage";
import { CreateBlogPage } from "./pages/CreateBlogPage";
import { EditBlogPage } from "./pages/EditBlogPage";
import { DashboardPage } from "./pages/DashboardPage";

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-[#faf9f6] text-stone-900 font-sans selection:bg-blue-100 selection:text-blue-900">
          <Navbar />

          <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/posts/:id" element={<BlogDetailsPage />} />

              {/* Protected routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/create" element={<CreateBlogPage />} />
                <Route path="/edit/:id" element={<EditBlogPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
              </Route>

              {/* Catch-all 404 */}
              <Route
                path="*"
                element={
                  <div className="py-20 text-center space-y-4">
                    <h1 className="font-serif text-4xl font-bold text-stone-900">404</h1>
                    <p className="text-stone-500">Page not found.</p>
                  </div>
                }
              />
            </Routes>
          </main>

          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
