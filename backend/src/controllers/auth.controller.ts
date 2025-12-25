import { Request, Response } from "express";
import pool from "../config/db";
import { signToken } from "../utils/jwt";

export const signup = async (req: Request, res: Response) => {
  const { email, name } = req.body;

  if (!email) {
    return res.status(400).json({
      message: "Email is required",
    });
  }

  try {
    const result = await pool.query(
      `
      INSERT INTO users (email, name, provider)
      VALUES ($1, $2, 'local')
      ON CONFLICT (email)
      DO NOTHING
      RETURNING id, email
      `,
      [email, name]
    );

    if (result.rows.length === 0) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    const user = result.rows[0];

    const token = signToken({
      userId: user.id,
      email: user.email,
    });

    res.status(201).json({
      message: "Signup successful",
      token,
    });
  } catch (err: any) {
    console.log(err.message);
    res.status(500).json({ message: "Signup failed" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      message: "Email is required",
    });
  }

  try {
    const result = await pool.query(
      `SELECT id, email FROM users WHERE email = $1`,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = result.rows[0];

    const token = signToken({
      userId: user.id,
      email: user.email,
    });

    res.json({
      message: "Login successful",
      token,
    });
  } catch (err: any) {
    res.status(500).json({ message: "Login failed" });
  }
};
