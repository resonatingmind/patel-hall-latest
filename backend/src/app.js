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
  "https://patel-hall.vercel.app",
  process.env.FRONTEND_URL, // set this in Render env vars
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (mobile apps, curl, etc.)
      console.log("Incoming Origin:", origin);
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    optionsSuccessStatus: 200,
  }),
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

// ============ DEBUG — REMOVE AFTER FIXING ============
// Single comprehensive debug endpoint
// GET /api/debug/full  (with Authorization: Bearer <token>)
app.get("/api/debug/full", async (req, res) => {
  const result = {
    step: "init",
    env: {
      SUPABASE_URL: process.env.SUPABASE_URL ? "✅ set" : "❌ MISSING",
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY
        ? `✅ set (${process.env.SUPABASE_SERVICE_ROLE_KEY.length} chars)`
        : "❌ MISSING",
      DATABASE_URL: process.env.DATABASE_URL
        ? `✅ set (host: ${process.env.DATABASE_URL.match(/@([^:]+)/)?.[1] ?? "?"})`
        : "❌ MISSING",
      NODE_ENV: process.env.NODE_ENV ?? "not set",
    },
    token: null,
    supabase: null,
    db: null,
    userById: null,
    userByEmail: null,
    userCount: null,
    error: null,
  };

  try {
    // --- Token ---
    result.step = "token";
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];
    result.token = token
      ? {
          length: token.length,
          preview: `${token.slice(0, 20)}…${token.slice(-10)}`,
        }
      : "❌ No Bearer token in Authorization header";
    if (!token) return res.json(result);

    // --- Supabase auth ---
    result.step = "supabase-getUser";
    const { supabase } = await import("./config/supabase.js");
    const { data, error } = await supabase.auth.getUser(token);
    result.supabase = error
      ? { error: error.message }
      : { userId: data.user.id, email: data.user.email };
    if (error) return res.json(result);

    const userId = data.user.id;
    const email = data.user.email;

    // --- DB connectivity ---
    result.step = "db-connect";
    const { prisma } = await import("./config/prisma.js");
    const ping = await prisma.$queryRaw`SELECT 1 as ok`;
    result.db = ping ? "✅ connected" : "❌ no response";

    // --- User lookup by ID ---
    result.step = "prisma-findById";
    result.userById = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, role: true },
    });

    // --- User lookup by email ---
    result.step = "prisma-findByEmail";
    result.userByEmail = email
      ? await prisma.user.findUnique({
          where: { email },
          select: { id: true, email: true, role: true },
        })
      : null;

    // --- Total users ---
    result.step = "prisma-count";
    result.userCount = await prisma.user.count();

    result.step = "done";
  } catch (e) {
    result.error = {
      message: e.message,
      failedAtStep: result.step,
      stack: e.stack?.split("\n").slice(0, 5),
    };
  }

  return res.json(result);
});
// ============ END DEBUG ============

export default app;
