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

router.get("/", authenticate, getPayments);
router.get("/:id", authenticate, getPaymentById);
router.post("/", authenticate, createPayment);
router.patch("/:id", authenticate, updatePayment);
router.delete("/:id", authenticate, deletePayment);

export default router;
