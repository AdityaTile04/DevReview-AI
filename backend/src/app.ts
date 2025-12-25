import express from "express";
import demoRoutes from "./routes/demo.route";
import healthRoutes from "./routes/health.route";
import protectedRoutes from "./routes/protected.route";

const app = express();

app.use(express.json());

app.use("/api", demoRoutes);
app.use("/api/health", healthRoutes);
app.use("/api/protected", protectedRoutes);

export default app;
