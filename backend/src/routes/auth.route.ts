import { Router } from "express";
import {
  githubAuth,
  googleAuth,
  login,
  signup,
} from "../controllers/auth.controller";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/google", googleAuth);
router.post("/github", githubAuth);

export default router;
