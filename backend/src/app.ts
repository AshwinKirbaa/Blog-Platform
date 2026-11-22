import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { config } from "./config/index.js";

const app = express();

app.use(cors({
  origin: config.corsOrigin,
  credentials: true
}));

app.use(express.json());

// API health endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Blog Platform REST API is running",
    timestamp: new Date().toISOString()
  });
});

// Mount modular API routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);

// Centralized error handler
app.use(errorHandler);

export default app;
