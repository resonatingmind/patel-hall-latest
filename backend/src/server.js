import "dotenv/config";
import app from "./app.js";
import userRoutes from "./modules/users/user.routes.js";
import studentRoutes from "./modules/students/student.routes.js";
import alumniRoutes from "./modules/alumni/alumni.routes.js";
import grievanceRoutes from "./modules/grievance/grievance.routes.js";
const PORT = process.env.PORT || 5001;
console.log(PORT);

app.get("/", (req, res) => {
  res.send("Welcome to the Patel Hall API!");
});

app.use("/api/users", userRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/alumni", alumniRoutes);
app.use("/api/grievances", grievanceRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
