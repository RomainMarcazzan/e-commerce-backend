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

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and retrieval
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve a paginated list of users
 *     tags: [Users]
 *     description: Get a paginated list of users. Use query parameters "page" and "limit" for pagination.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *           default: 1
 *         description: Page number for pagination.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           default: 10
 *         description: Number of users per page.
 *     responses:
 *       200:
 *         description: A paginated list of users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       401:
 *         description: User not authenticated
 */
router.get("/", authenticate, getUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Retrieve a user by ID
 *     tags: [Users]
 *     description: Get the details of a specific user by their ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *       401:
 *         description: User not authenticated
 *       404:
 *         description: User not found
 */
router.get("/:id", authenticate, getUserById);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     description: Create a new user with the provided details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "John"
 *               lastName:
 *                 type: string
 *                 example: "Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "securepassword"
 *               phoneNumber:
 *                 type: string
 *                 example: "+1234567890"
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *       400:
 *         description: Bad request, invalid input
 */
router.post("/", createUser);

/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     summary: Update an existing user
 *     tags: [Users]
 *     description: Update the details of an existing user by their ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "Updated First Name"
 *               lastName:
 *                 type: string
 *                 example: "Updated Last Name"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "updated@example.com"
 *               phoneNumber:
 *                 type: string
 *                 example: "+1234567890"
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *       401:
 *         description: User not authenticated
 *       404:
 *         description: User not found
 */
router.patch("/:id", authenticate, updateUser);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Users]
 *     description: Delete a specific user by their ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *       401:
 *         description: User not authenticated
 *       404:
 *         description: User not found
 */
router.delete("/:id", authenticate, deleteUserById);

export default router;
