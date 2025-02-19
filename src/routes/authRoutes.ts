import { Router } from "express";
import {
  login,
  logout,
  lostCode,
  lostEmail,
  refresh,
  register,
} from "../controllers/authControllers";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.post("/lost-email", lostEmail);
router.post("/lost-code", lostCode);

export default router;
