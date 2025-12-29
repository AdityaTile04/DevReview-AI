import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.midddleware";
import pool from "../config/db";
import { reviewCodeWithAi } from "../utils/ai";
import { optimizeCodeWithAi } from "../utils/aiOptimise";

export const createReview = async (req: AuthRequest, res: Response) => {
  const { code, language, framework } = req.body;
  const userId = req.user!.userId;

  if (!code || !language) {
    return res.status(400).json({ message: "Code and language required" });
  }

  try {
    const reviewResult = await reviewCodeWithAi(code, language, framework);
    const optimizedCode = await optimizeCodeWithAi(code, language);

    const result = await pool.query(
      `
      INSERT INTO reviews (user_id, language, framework, code, result, score)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
      `,
      [
        userId,
        language,
        framework || null,
        code,
        reviewResult,
        reviewResult.score,
      ]
    );

    res.status(201).json({
      review: {
        ...result.rows[0],
        optimizedCode,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to review code" });
  }
};

export const getReviews = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.userId;

  try {
    const result = await pool.query(
      `
              SELECT id, language, framework, score, created_at
              FROM reviews
              WHERE user_id = $1
              ORDER BY created_at DESC
              `,
      [userId]
    );

    res.json({
      reviews: result.rows,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
};

export const getReviewsById = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.userId;
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT *
      FROM reviews
      WHERE id = $1 AND user_id = $2
      `,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.json({ review: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch review" });
  }
};
