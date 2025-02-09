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
 * /order:
 *   get:
 *     summary: Retrieve a list of orders
 *     responses:
 *       200:
 *         description: A list of orders
 */
router.get("/", authenticate, getOrders);

/**
 * @swagger
 * /order/{id}:
 *   get:
 *     summary: Retrieve an order by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order details
 */
router.get("/:id", authenticate, getOrderById);

/**
 * @swagger
 * /order:
 *   post:
 *     summary: Create a new order
 *     responses:
 *       201:
 *         description: Order created
 */
router.post("/", authenticate, createOrder);

/**
 * @swagger
 * /order/{id}:
 *   patch:
 *     summary: Update an order by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order updated
 */
router.patch("/:id", authenticate, updateOrder);

/**
 * @swagger
 * /order/{id}:
 *   delete:
 *     summary: Delete an order by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order deleted
 */
router.delete("/:id", authenticate, deleteOrder);

export default router;
