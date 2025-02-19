import { Router } from "express";
import {
  getUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUserById,
} from "../controllers/userControllers";
import { authenticate } from "../middlewares/authenticateMiddleware";

const router = Router();

router.get("/", authenticate, getUsers);
router.get("/:id", authenticate, getUserById);
router.post("/", createUser);
router.patch("/:id", authenticate, updateUser);
router.delete("/:id", authenticate, deleteUserById);

export default router;
