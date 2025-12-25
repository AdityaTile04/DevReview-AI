import express from "express";
import protectedRoutes from "./routes/protected.route";
import authRoutes from "./routes/auth.route";

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/protected", protectedRoutes);

export default app;
