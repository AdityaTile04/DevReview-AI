import { Request, Response } from "express";
import pool from "../config/db";
import { signToken } from "../utils/jwt";
import { OAuth2Client } from "google-auth-library";
import axios from "axios";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const githubAuth = async (req: any, res: any) => {
  const { code } = req.body;

  if (!code) {
    return res.status(404).json({ message: "github code missing" });
  }

  try {
    const tokenResponse = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      {
        headers: { Accept: "application/json" },
      }
    );

    const accessToken = tokenResponse.data.access_token;

    if (!accessToken) {
      return res.status(401).json({ message: "Github access token failed" });
    }

    const userResponse = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const { id, email, name, avatar_url } = userResponse.data;

    const userEmail = email || `${id}@users.noreply.github.com`;

    const result = await pool.query(
      `
      INSERT INTO users (email, name, avatar_url, provider, provider_id)
      VALUES ($1, $2, $3, 'github', $4)
      ON CONFLICT (email)
      DO UPDATE SET
        name = EXCLUDED.name,
        avatar_url = EXCLUDED.avatar_url,
        provider = 'github',
        provider_id = EXCLUDED.provider_id
      RETURNING id, email
      `,
      [userEmail, name, avatar_url, id.toString()]
    );

    const user = result.rows[0];

    const token = signToken({
      userId: user.id,
      email: user.email,
    });

    res.json({
      message: "Github login successful",
      token,
    });
  } catch (err) {
    res.status(401).json({ message: "Github authentication failed" });
  }
};

export const googleAuth = async (req: any, res: any) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({ message: "Google token missing" });
  }

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.email) {
      return res.status(401).json({ message: "Invalid Google token" });
    }

    const { sub, email, name, picture } = payload;

    const result = await pool.query(
      `
        INSERT INTO users (email, name, avatar_url, provider, provider_id)
        VALUES ($1, $2, $3, 'google', $4)
        ON CONFLICT (email)
        DO UPDATE SET
          name = EXCLUDED.name,
          avatar_url = EXCLUDED.avatar_url,
          provider = 'google',
          provider_id = EXCLUDED.provider_id
        RETURNING id, email
        `,
      [email, name, picture, sub]
    );

    const user = result.rows[0];

    const token = signToken({
      userId: user.id,
      email: user.email,
    });

    res.json({ message: "Google login successful", token });
  } catch (err) {
    console.error("GOOGLE AUTH ERROR: ", err);
    res.status(401).json({
      message: "Google authentication failed",
    });
  }
};

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
