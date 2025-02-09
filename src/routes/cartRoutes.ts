import { Router } from "express";
import {
  getCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../controllers/cartControllers";
import { authenticate } from "../middlewares/authenticateMiddleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Cart management and retrieval
 */

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Retrieve a user's cart
 *     tags: [Cart]
 *     description: Get the current user's cart along with items and product details.
 *     responses:
 *       200:
 *         description: Cart details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 cart:
 *                   type: object
 *       401:
 *         description: User not authenticated or cart not found
 */
router.get("/", authenticate, getCart);

/**
 * @swagger
 * /cart/item:
 *   post:
 *     summary: Add an item to the cart
 *     tags: [Cart]
 *     description: Add a new item into the current user's cart.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 example: "12345"
 *               quantity:
 *                 type: number
 *                 example: 2
 *     responses:
 *       201:
 *         description: Cart item added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 cartItem:
 *                   type: object
 *       401:
 *         description: User not authenticated
 */
router.post("/item", authenticate, addCartItem);

/**
 * @swagger
 * /cart/item/{id}:
 *   patch:
 *     summary: Update a cart item
 *     tags: [Cart]
 *     description: Update the quantity of an existing cart item.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The cart item id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: number
 *                 example: 3
 *     responses:
 *       200:
 *         description: Cart item updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 cartItem:
 *                   type: object
 *       401:
 *         description: User not authenticated
 *       404:
 *         description: Cart item not found or access denied
 */
router.patch("/item/:id", authenticate, updateCartItem);

/**
 * @swagger
 * /cart/item/{id}:
 *   delete:
 *     summary: Remove an item from the cart
 *     tags: [Cart]
 *     description: Remove a specific item from the user's cart.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The cart item id
 *     responses:
 *       200:
 *         description: Cart item removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 cartItem:
 *                   type: object
 *       401:
 *         description: User not authenticated
 *       404:
 *         description: Cart item not found or access denied
 */
router.delete("/item/:id", authenticate, removeCartItem);

/**
 * @swagger
 * /cart/clear:
 *   delete:
 *     summary: Clear the entire cart
 *     tags: [Cart]
 *     description: Remove all items from the current user's cart.
 *     responses:
 *       200:
 *         description: Cart cleared successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: User not authenticated
 */
router.delete("/clear", authenticate, clearCart);

export default router;
