import express from "express";
import cors from "cors";
import userRoutes from "./modules/users/user.routes.js";
import authRoutes from "./modules/auth/auth.routes.js";
import studentRoutes from "./modules/students/student.routes.js";
import councilRoutes from "./modules/council/council.routes.js";
import alumniRoutes from "./modules/alumni/alumni.routes.js";
import grievanceRoutes from "./modules/grievance/grievance.routes.js";
import participationRoutes from "./modules/participation/participation.routes.js";
import eventRoutes from "./modules/events/event.routes.js";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  process.env.FRONTEND_URL,       // set this in Render env vars
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (mobile apps, curl, etc.)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/council", councilRoutes);
app.use("/api/alumni", alumniRoutes);
app.use("/api/grievances", grievanceRoutes);
app.use("/api/participation", participationRoutes);
app.use("/api/events", eventRoutes);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Diagnostic endpoint — remove after debugging
app.get("/api/debug/env", (_req, res) => {
  res.json({
    SUPABASE_URL: process.env.SUPABASE_URL ? "✅ set" : "❌ MISSING",
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY
      ? `✅ set (starts with ${process.env.SUPABASE_SERVICE_ROLE_KEY.slice(0, 10)}…)`
      : "❌ MISSING",
    DATABASE_URL: process.env.DATABASE_URL ? "✅ set" : "❌ MISSING",
    NODE_ENV: process.env.NODE_ENV ?? "not set",
    PORT: process.env.PORT ?? "not set",
  });
});

// Token debug endpoint — remove after debugging
// Send: GET /api/debug/token with Authorization: Bearer <your-token>
app.get("/api/debug/token", async (req, res) => {
  const { supabase } = await import("./config/supabase.js");

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.json({ error: "No Authorization header sent" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.json({ error: "No token found after 'Bearer'" });
  }

  try {
    const { data, error } = await supabase.auth.getUser(token);
    return res.json({
      tokenPreview: `${token.slice(0, 20)}…${token.slice(-10)}`,
      tokenLength: token.length,
      supabaseError: error?.message ?? null,
      userId: data?.user?.id ?? null,
      email: data?.user?.email ?? null,
    });
  } catch (e) {
    return res.json({
      tokenPreview: `${token.slice(0, 20)}…${token.slice(-10)}`,
      tokenLength: token.length,
      thrownError: e.message,
    });
  }
});

export default app;
