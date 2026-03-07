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

app.use(cors());
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

export default app;
