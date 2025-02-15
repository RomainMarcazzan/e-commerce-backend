import { NextFunction, Response, Request } from "express";
import { z } from "zod";
import prisma from "../lib/prisma";

const createCategorySchema = z.object({
  name: z.string().min(1, { message: "Category name is required" }),
});

const updateCategorySchema = z.object({
  name: z.string().min(1, { message: "Category name is required" }),
});

const getCategoriesQuerySchema = z.object({
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(10),
});

export const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = createCategorySchema.parse(req.body);
    const category = await prisma.category.create({ data });
    res
      .status(201)
      .json({ message: "Category created successfully", category });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const data = updateCategorySchema.parse(req.body);
    const category = await prisma.category.update({ where: { id }, data });
    res
      .status(200)
      .json({ message: "Category updated successfully", category });
  } catch (error) {
    next(error);
  }
};

export const getCategoryById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) {
      res.status(404).json({ message: "Category not found" });
      return;
    }
    res
      .status(200)
      .json({ message: "Category retrieved successfully", category });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const category = await prisma.category.delete({ where: { id } });
    res
      .status(200)
      .json({ message: "Category deleted successfully", category });
  } catch (error) {
    next(error);
  }
};

export const getCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page, limit } = getCategoriesQuerySchema.parse(req.query);
    const skip = (page - 1) * limit;
    const categories = await prisma.category.findMany({ skip, take: limit });
    res.status(200).json({
      message: "Categories retrieved successfully",
      categories,
    });
  } catch (error) {
    next(error);
  }
};
