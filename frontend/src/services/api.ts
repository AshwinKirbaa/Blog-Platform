import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json"
  }
});

// Attach Authorization Bearer token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("blog_auth_token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle global responses and unauthorized token eviction
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // If 401 and not an explicit login/register call, clear local auth
      const url = error.config?.url || "";
      if (!url.includes("/auth/login") && !url.includes("/auth/register")) {
        localStorage.removeItem("blog_auth_token");
      }
    }
    return Promise.reject(error);
  }
);
