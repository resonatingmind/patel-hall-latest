import "dotenv/config";
import app from "./app.js";

const PORT = process.env.PORT || 5001;

app.get("/", (_req, res) => {
  res.send("Welcome to the Patel Hall API!");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
