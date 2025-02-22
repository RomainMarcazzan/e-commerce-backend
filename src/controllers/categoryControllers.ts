import { NextFunction, Response, Request } from "express";
import { z } from "zod";
import prisma from "../lib/prisma";
import { Prisma } from "@prisma/client"; // <-- added import

const createCategorySchema = z.object({
  name: z.string().min(1, { message: "Category name is required" }),
});

const updateCategorySchema = z.object({
  name: z.string().min(1, { message: "Category name is required" }),
});

const getCategoriesQuerySchema = z.object({
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(10),
  search: z.string().optional(), // <-- optional search parameter
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
  } catch (error: any) {
    // Handle unique constraint error from Prisma (code: P2002)
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      res
        .status(400)
        .json({ message: "Category with this name already exists" });
      return;
    }
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
    const { page, limit, search } = getCategoriesQuerySchema.parse(req.query);
    const skip = (page - 1) * limit;
    const where = search
      ? { name: { contains: search, mode: Prisma.QueryMode.insensitive } } // <-- cast mode as const
      : {};
    const categories = await prisma.category.findMany({
      where,
      skip,
      take: limit,
    });
    res.status(200).json({
      message: "Categories retrieved successfully",
      categories,
    });
  } catch (error) {
    next(error);
  }
};
