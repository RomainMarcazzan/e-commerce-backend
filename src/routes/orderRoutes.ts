import { Router } from "express";
import {
  getOrders,
  createOrder,
  getOrderById,
  updateOrder,
  deleteOrder,
} from "../controllers/orderControllers";
import { authenticate } from "../middlewares/authenticateMiddleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management and retrieval
 */

/**
 * @swagger
 * /order:
 *   get:
 *     summary: Retrieve a list of orders
 *     tags: [Orders]
 *     description: Get a list of all orders for the authenticated user.
 *     responses:
 *       200:
 *         description: A list of orders retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 orders:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: User not authenticated
 */
router.get("/", authenticate, getOrders);

/**
 * @swagger
 * /order/{id}:
 *   get:
 *     summary: Retrieve an order by ID
 *     tags: [Orders]
 *     description: Get the details of a specific order by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The order ID
 *     responses:
 *       200:
 *         description: Order details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 order:
 *                   type: object
 *       401:
 *         description: User not authenticated
 *       404:
 *         description: Order not found
 */
router.get("/:id", authenticate, getOrderById);

/**
 * @swagger
 * /order:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     description: Create a new order with the provided details.
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
 *               totalPrice:
 *                 type: number
 *                 example: 100.50
 *               status:
 *                 type: string
 *                 example: "PENDING"
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                       example: "product123"
 *                     quantity:
 *                       type: number
 *                       example: 2
 *                     price:
 *                       type: number
 *                       example: 50.25
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 order:
 *                   type: object
 *       401:
 *         description: User not authenticated
 *       400:
 *         description: Invalid input
 */
router.post("/", authenticate, createOrder);

/**
 * @swagger
 * /order/{id}:
 *   patch:
 *     summary: Update an order by ID
 *     tags: [Orders]
 *     description: Update the details of an existing order by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               totalPrice:
 *                 type: number
 *                 example: 120.75
 *               status:
 *                 type: string
 *                 example: "COMPLETED"
 *     responses:
 *       200:
 *         description: Order updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 order:
 *                   type: object
 *       401:
 *         description: User not authenticated
 *       404:
 *         description: Order not found
 */
router.patch("/:id", authenticate, updateOrder);

/**
 * @swagger
 * /order/{id}:
 *   delete:
 *     summary: Delete an order by ID
 *     tags: [Orders]
 *     description: Delete a specific order by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The order ID
 *     responses:
 *       200:
 *         description: Order deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 order:
 *                   type: object
 *       401:
 *         description: User not authenticated
 *       404:
 *         description: Order not found
 */
router.delete("/:id", authenticate, deleteOrder);

export default router;
