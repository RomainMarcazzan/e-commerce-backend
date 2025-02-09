import { Router } from "express";
import {
  login,
  logout,
  refresh,
  register,
} from "../controllers/authControllers";

const router = Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     responses:
 *       201:
 *         description: User registered
 */
router.post("/register", register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in a user
 *     responses:
 *       200:
 *         description: User logged in
 */
router.post("/login", login);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh authentication token
 *     responses:
 *       200:
 *         description: Token refreshed
 */
router.post("/refresh", refresh);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Log out a user
 *     responses:
 *       200:
 *         description: User logged out
 */
router.post("/logout", logout);

export default router;
