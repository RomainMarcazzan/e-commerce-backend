import { Router } from "express";
import {
  getCart,
  addItemToCart,
  updateCartItem,
  removeCartItem,
} from "../controllers/cartController";

const router = Router();

router.get("/:userId", getCart);
router.post("/:userId/item", addItemToCart);
router.put("/:userId/item/:itemId", updateCartItem);
router.delete("/:userId/item/:itemId", removeCartItem);

export default router;
