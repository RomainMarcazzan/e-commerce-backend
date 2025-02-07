import { Router } from "express";
import { getUsers, createUser } from "../controllers/userController";

const router = Router();

router.get("/", getUsers);
router.post("/", createUser);

// ...additional routes...

export default router;
