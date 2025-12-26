import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.midddleware';
import { createReview } from '../controllers/review.controller';

const router = Router();

router.post('/', authMiddleware, createReview)

export default router;