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

router.get("/", authenticate, getOrders);
router.get("/:id", authenticate, getOrderById);
router.post("/", authenticate, createOrder);
router.patch("/:id", authenticate, updateOrder);
router.delete("/:id", authenticate, deleteOrder);

export default router;
