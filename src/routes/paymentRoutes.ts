import { Router } from "express";
import {
  createPayment,
  updatePayment,
  getPaymentById,
  deletePayment,
  getPayments,
} from "../controllers/paymentControllers";
import { authenticate } from "../middlewares/authenticateMiddleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Payment management and retrieval
 */

/**
 * @swagger
 * /payment:
 *   get:
 *     summary: Retrieve a paginated list of payments
 *     tags: [Payments]
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
 *         description: Number of payments per page.
 *     responses:
 *       200:
 *         description: A paginated list of payments retrieved successfully
 *       401:
 *         description: User not authenticated
 */
router.get("/", authenticate, getPayments);

/**
 * @swagger
 * /payment/{id}:
 *   get:
 *     summary: Retrieve a payment by ID
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The payment ID
 *     responses:
 *       200:
 *         description: Payment details retrieved successfully
 *       401:
 *         description: User not authenticated
 *       404:
 *         description: Payment not found
 */
router.get("/:id", authenticate, getPaymentById);

/**
 * @swagger
 * /payment:
 *   post:
 *     summary: Create a new payment
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderId:
 *                 type: string
 *                 example: "order123"
 *               amount:
 *                 type: number
 *                 example: 150.00
 *               method:
 *                 type: string
 *                 example: "CARD"
 *               stripePaymentIntentId:
 *                 type: string
 *                 example: "pi_123"
 *               stripePaymentMethodId:
 *                 type: string
 *                 example: "pm_123"
 *     responses:
 *       201:
 *         description: Payment created successfully
 *       401:
 *         description: User not authenticated
 */
router.post("/", authenticate, createPayment);

/**
 * @swagger
 * /payment/{id}:
 *   patch:
 *     summary: Update an existing payment
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The payment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 175.50
 *               method:
 *                 type: string
 *                 example: "CARD"
 *     responses:
 *       200:
 *         description: Payment updated successfully
 *       401:
 *         description: User not authenticated
 *       404:
 *         description: Payment not found
 */
router.patch("/:id", authenticate, updatePayment);

/**
 * @swagger
 * /payment/{id}:
 *   delete:
 *     summary: Delete a payment by ID
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The payment ID
 *     responses:
 *       200:
 *         description: Payment deleted successfully
 *       401:
 *         description: User not authenticated
 *       404:
 *         description: Payment not found
 */
router.delete("/:id", authenticate, deletePayment);

export default router;
