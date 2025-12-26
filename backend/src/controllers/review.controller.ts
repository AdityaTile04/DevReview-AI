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
