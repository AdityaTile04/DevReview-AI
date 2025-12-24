import { Router } from "express";

const router = Router();

router.get("/demo", (req, res) => {
  res.json({ message: "hello from demo route" });
});

export default router;
