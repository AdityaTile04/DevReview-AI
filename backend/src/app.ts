import cors from "cors";
import express from "express";
import protectedRoutes from "./routes/protected.route";
import authRoutes from "./routes/auth.route";
import reviewRoutes from "./routes/review.route";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/protected", protectedRoutes);
app.use("/api/reviews", reviewRoutes);

export default app;
