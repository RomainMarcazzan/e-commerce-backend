import { Request, Response } from "express";
import prisma from "../lib/prisma";

// Get all products
export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

// Get a single product by id
export const getProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({ where: { id } });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch product" });
  }
};

// Create a new product
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, price, stock, imageUrl, categoryId } = req.body;
    const product = await prisma.product.create({
      data: { name, description, price, stock, imageUrl, categoryId },
    });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Failed to create product" });
  }
};

// Update an existing product
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const product = await prisma.product.update({ where: { id }, data });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Failed to update product" });
  }
};

// Delete a product
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.delete({ where: { id } });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete product" });
  }
};
