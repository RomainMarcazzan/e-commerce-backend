import { NextFunction, Response, Request } from "express";
import { z } from "zod";
import prisma from "../lib/prisma";

const createProductSchema = z.object({
  name: z.string().min(1, { message: "Product name is required" }),
  description: z
    .string()
    .min(1, { message: "Product description is required" }),
  price: z.number({ invalid_type_error: "Price must be a number" }),
  stock: z.number({ invalid_type_error: "Stock must be a number" }),
  categoryId: z.string().min(1, { message: "Category ID is required" }),
  imageUrl: z.string().optional(),
});

const updateProductSchema = createProductSchema.partial();

// Updated schema for query parameters to coerce strings to numbers
const getProductsQuerySchema = z.object({
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(10),
});

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = createProductSchema.parse(req.body);
    const product = await prisma.product.create({ data });
    res.status(201).json({ message: "Product created successfully", product });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const data = updateProductSchema.parse(req.body);
    const product = await prisma.product.update({ where: { id }, data });

    res.status(200).json({ message: "Product updated successfully", product });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res
      .status(200)
      .json({ message: "Product retrieved successfully", product });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.delete({ where: { id } });
    res.status(200).json({ message: "Product deleted successfully", product });
  } catch (error) {
    next(error);
  }
};

export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page, limit } = getProductsQuerySchema.parse(req.query);
    const skip = (page - 1) * limit;
    const products = await prisma.product.findMany({ skip, take: limit });
    res
      .status(200)
      .json({ message: "Products retrieved successfully", products });
  } catch (error) {
    next(error);
  }
};
