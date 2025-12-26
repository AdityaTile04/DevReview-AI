import express from "express";
import protectedRoutes from "./routes/protected.route";
import authRoutes from "./routes/auth.route";
import reviewRoutes from "./routes/review.route";

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/protected", protectedRoutes);
app.use("/api/reviews", reviewRoutes);

export default app;
