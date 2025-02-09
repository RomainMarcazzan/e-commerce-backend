import { Router } from "express";
import {
  createCategory,
  updateCategory,
  getCategoryById,
  deleteCategory,
  getCategories,
} from "../controllers/categoryControllers";

const router = Router();

router.get("/", getCategories);
router.get("/:id", getCategoryById);
router.post("/", createCategory);
router.patch("/:id", updateCategory);
router.delete("/:id", deleteCategory);

export default router;
