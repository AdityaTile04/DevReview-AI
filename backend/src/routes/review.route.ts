import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.midddleware";
import {
  createReview,
  getReviews,
  getReviewsById,
} from "../controllers/review.controller";

const router = Router();

router.post("/", authMiddleware, createReview);
router.get("/", authMiddleware, getReviews);
router.get("/:id", authMiddleware, getReviewsById);

export default router;
