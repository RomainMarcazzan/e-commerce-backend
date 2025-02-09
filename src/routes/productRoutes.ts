import { Router } from "express";
import {
  getProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productControllers";
import { authenticate } from "../middlewares/authenticateMiddleware";

const router = Router();

// Swagger: Retrieve a list of products
/**
 * @swagger
 * /product:
 *   get:
 *     summary: Retrieve a list of products
 *     description: Get a list of all products.
 *     responses:
 *       200:
 *         description: A list of products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 products:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: User not authenticated
 */
router.get("/", getProducts);

// Swagger: Retrieve a product by ID
/**
 * @swagger
 * /product/{id}:
 *   get:
 *     summary: Retrieve a product by ID
 *     description: Get the details of a specific product by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The product ID
 *     responses:
 *       200:
 *         description: Product details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 product:
 *                   type: object
 *       401:
 *         description: User not authenticated
 *       404:
 *         description: Product not found
 */
router.get("/:id", getProductById);

// Swagger: Create a new product
/**
 * @swagger
 * /product:
 *   post:
 *     summary: Create a new product
 *     description: Create a new product with the provided details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Product Name"
 *               description:
 *                 type: string
 *                 example: "Product Description"
 *               price:
 *                 type: number
 *                 example: 99.99
 *               stock:
 *                 type: number
 *                 example: 100
 *               categoryId:
 *                 type: string
 *                 example: "category123"
 *               imageUrl:
 *                 type: string
 *                 example: "http://example.com/image.jpg"
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 product:
 *                   type: object
 *       401:
 *         description: User not authenticated
 *       400:
 *         description: Invalid input
 */
router.post("/", authenticate, createProduct);

// Swagger: Update an existing product
/**
 * @swagger
 * /product/{id}:
 *   patch:
 *     summary: Update an existing product
 *     description: Update the details of an existing product by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated Product Name"
 *               description:
 *                 type: string
 *                 example: "Updated Product Description"
 *               price:
 *                 type: number
 *                 example: 89.99
 *               stock:
 *                 type: number
 *                 example: 150
 *               categoryId:
 *                 type: string
 *                 example: "category123"
 *               imageUrl:
 *                 type: string
 *                 example: "http://example.com/updated-image.jpg"
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 product:
 *                   type: object
 *       401:
 *         description: User not authenticated
 *       404:
 *         description: Product not found
 */
router.patch("/:id", authenticate, updateProduct);

// Swagger: Delete a product by ID
/**
 * @swagger
 * /product/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     description: Delete a specific product by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 product:
 *                   type: object
 *       401:
 *         description: User not authenticated
 *       404:
 *         description: Product not found
 */
router.delete("/:id", authenticate, deleteProduct);

export default router;
