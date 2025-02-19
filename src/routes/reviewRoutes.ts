import { Router } from "express";
import {
  getReviews,
  createReview,
  getReviewById,
  updateReview,
  deleteReview,
} from "../controllers/reviewControllers";
import { authenticate } from "../middlewares/authenticateMiddleware";

const router = Router();

// Removed swagger comments
router.get("/", authenticate, getReviews);
router.get("/:id", authenticate, getReviewById);
router.post("/", authenticate, createReview);
router.patch("/:id", authenticate, updateReview);
router.delete("/:id", authenticate, deleteReview);

export default router;
