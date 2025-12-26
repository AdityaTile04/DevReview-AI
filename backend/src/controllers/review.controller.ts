import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.midddleware";
import pool from "../config/db";

export const createReview = async (req: AuthRequest, res: Response) => {
  const { code, language, framework } = req.body;
  const userId = req.user!.userId;

  if (!code || !language) {
    return res.status(400).json({
      message: "Code and language are required",
    });
  }

  const aiResult = {
    summary: "Code looks clean but can be improved",
    issues: [
      {
        line: 3,
        message: "Avoid hardcoded values",
        severity: "medium",
      },
    ],
    suggestions: [
      "Use environment variables for configs",
      "Add proper error handling",
    ],
    score: 78,
  };

  try {
    const result = await pool.query(
      `
        INSERT INTO reviews (
          user_id,
          language,
          framework,
          code,
          result,
          score
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
        `,
      [userId, language, framework || null, code, aiResult, aiResult.score]
    );

    res.status(201).json({
      message: "Code reviewed successfully",
      review: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({
      message: "failed to create review",
    });
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
