import { Router } from "express";
import pool from "../config/db";

const router = Router();

router.get("/db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ status: "ok", time: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      message: "Database connection failed",
    });
  }
});

export default router;
