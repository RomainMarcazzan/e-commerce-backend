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

router.get("/", authenticate, getCart);
router.post("/item", authenticate, addCartItem);
router.patch("/item/:id", authenticate, updateCartItem);
router.delete("/item/:id", authenticate, removeCartItem);
router.delete("/clear", authenticate, clearCart);

export default router;
