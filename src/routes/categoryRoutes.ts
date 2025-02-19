import { Router } from "express";
import {
  createCategory,
  updateCategory,
  getCategoryById,
  deleteCategory,
  getCategories,
} from "../controllers/categoryControllers";
import { authenticate } from "../middlewares/authenticateMiddleware";

const router = Router();

router.get("/", getCategories);
router.get("/:id", getCategoryById);
router.post("/", authenticate, createCategory);
router.patch("/:id", authenticate, updateCategory);
router.delete("/:id", authenticate, deleteCategory);

export default router;
