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
 * tags:
 *   name: Reviews
 *   description: Review management and retrieval
 */

/**
 * @swagger
 * /review:
 *   get:
 *     summary: Retrieve a paginated list of reviews
 *     tags: [Reviews]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *           default: 1
 *         description: Page number for pagination.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           default: 10
 *         description: Number of reviews per page.
 *     responses:
 *       200:
 *         description: A paginated list of reviews retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 reviews:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: User not authenticated
 */
router.get("/", authenticate, getReviews);

/**
 * @swagger
 * /review/{id}:
 *   get:
 *     summary: Retrieve a review by ID
 *     tags: [Reviews]
 *     description: Get the details of a specific review by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The review ID
 *     responses:
 *       200:
 *         description: Review details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 review:
 *                   type: object
 *       401:
 *         description: User not authenticated
 *       404:
 *         description: Review not found
 */
router.get("/:id", authenticate, getReviewById);

/**
 * @swagger
 * /review:
 *   post:
 *     summary: Create a new review
 *     tags: [Reviews]
 *     description: Create a new review with the provided details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "user123"
 *               productId:
 *                 type: string
 *                 example: "product123"
 *               rating:
 *                 type: number
 *                 example: 5
 *               comment:
 *                 type: string
 *                 example: "Great product!"
 *     responses:
 *       201:
 *         description: Review created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 review:
 *                   type: object
 *       401:
 *         description: User not authenticated
 *       400:
 *         description: Invalid input
 */
router.post("/", authenticate, createReview);

/**
 * @swagger
 * /review/{id}:
 *   patch:
 *     summary: Update an existing review
 *     tags: [Reviews]
 *     description: Update the details of an existing review by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The review ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *                 example: 4
 *               comment:
 *                 type: string
 *                 example: "Good product!"
 *     responses:
 *       200:
 *         description: Review updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 review:
 *                   type: object
 *       401:
 *         description: User not authenticated
 *       404:
 *         description: Review not found
 */
router.patch("/:id", authenticate, updateReview);

/**
 * @swagger
 * /review/{id}:
 *   delete:
 *     summary: Delete a review by ID
 *     tags: [Reviews]
 *     description: Delete a specific review by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The review ID
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 review:
 *                   type: object
 *       401:
 *         description: User not authenticated
 *       404:
 *         description: Review not found
 */
router.delete("/:id", authenticate, deleteReview);

export default router;
