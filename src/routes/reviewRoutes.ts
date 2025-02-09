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

router.get("/", getReviews);
router.get("/:id", getReviewById);
router.post("/", authenticate, createReview);
router.patch("/:id", authenticate, updateReview);
router.delete("/:id", authenticate, deleteReview);

export default router;
