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
 * /cart:
 *   get:
 *     summary: Retrieve a user's cart
 *     responses:
 *       200:
 *         description: Cart details
 */
router.get("/", authenticate, getCart);

/**
 * @swagger
 * /cart/item:
 *   post:
 *     summary: Add an item to the cart
 *     responses:
 *       201:
 *         description: Cart item added
 */
router.post("/item", authenticate, addCartItem);

/**
 * @swagger
 * /cart/item/{id}:
 *   patch:
 *     summary: Update a cart item
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cart item updated
 */
router.patch("/item/:id", authenticate, updateCartItem);

/**
 * @swagger
 * /cart/item/{id}:
 *   delete:
 *     summary: Remove an item from the cart
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cart item removed
 */
router.delete("/item/:id", authenticate, removeCartItem);

/**
 * @swagger
 * /cart/clear:
 *   delete:
 *     summary: Clear the entire cart
 *     responses:
 *       200:
 *         description: Cart cleared
 */
router.delete("/clear", authenticate, clearCart);

export default router;
