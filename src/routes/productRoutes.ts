import { Router } from "express";
import {
  getProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  upload,
} from "../controllers/productControllers";
import { authenticate } from "../middlewares/authenticateMiddleware";

const router = Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", authenticate, upload.array("images", 10), createProduct);
router.patch("/:id", authenticate, upload.array("images", 10), updateProduct);
router.delete("/:id", authenticate, deleteProduct);

export default router;
