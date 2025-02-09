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

/**
 * @swagger
 * /review:
 *   get:
 *     summary: Retrieve a list of reviews
 *     responses:
 *       200:
 *         description: A list of reviews
 */
router.get("/", getReviews);

/**
 * @swagger
 * /review/{id}:
 *   get:
 *     summary: Retrieve a review by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review details
 */
router.get("/:id", getReviewById);

/**
 * @swagger
 * /review:
 *   post:
 *     summary: Create a new review
 *     responses:
 *       201:
 *         description: Review created
 */
router.post("/", authenticate, createReview);

/**
 * @swagger
 * /review/{id}:
 *   patch:
 *     summary: Update an existing review
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review updated
 */
router.patch("/:id", authenticate, updateReview);

/**
 * @swagger
 * /review/{id}:
 *   delete:
 *     summary: Delete a review by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review deleted
 */
router.delete("/:id", authenticate, deleteReview);

export default router;
