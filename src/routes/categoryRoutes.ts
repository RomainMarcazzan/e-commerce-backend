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

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Category management and retrieval
 */

/**
 * @swagger
 * /category:
 *   get:
 *     summary: Retrieve a paginated list of categories
 *     tags: [Categories]
 *     description: Get a paginated list of categories. Use query parameters "page" and "limit" for pagination.
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
 *         description: Number of categories per page.
 *     responses:
 *       200:
 *         description: A paginated list of categories retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 categories:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: User not authenticated
 */
router.get("/", getCategories);

/**
 * @swagger
 * /category/{id}:
 *   get:
 *     summary: Retrieve a category by ID
 *     tags: [Categories]
 *     description: Get the details of a specific category by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The category ID
 *     responses:
 *       200:
 *         description: Category details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 category:
 *                   type: object
 *       401:
 *         description: User not authenticated
 *       404:
 *         description: Category not found
 */
router.get("/:id", getCategoryById);

/**
 * @swagger
 * /category:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     description: Create a new category with the provided details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Category Name"
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 category:
 *                   type: object
 *       401:
 *         description: User not authenticated
 *       400:
 *         description: Invalid input
 */
router.post("/", authenticate, createCategory);

/**
 * @swagger
 * /category/{id}:
 *   patch:
 *     summary: Update an existing category
 *     tags: [Categories]
 *     description: Update the details of an existing category by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated Category Name"
 *     responses:
 *       200:
 *         description: Category updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 category:
 *                   type: object
 *       401:
 *         description: User not authenticated
 *       404:
 *         description: Category not found
 */
router.patch("/:id", authenticate, updateCategory);

/**
 * @swagger
 * /category/{id}:
 *   delete:
 *     summary: Delete a category by ID
 *     tags: [Categories]
 *     description: Delete a specific category by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The category ID
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 category:
 *                   type: object
 *       401:
 *         description: User not authenticated
 *       404:
 *         description: Category not found
 */
router.delete("/:id", authenticate, deleteCategory);

export default router;
