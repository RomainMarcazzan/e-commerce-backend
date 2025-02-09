import { NextFunction, Response, Request } from "express";
import { z } from "zod";
import prisma from "../lib/prisma";

const createReviewSchema = z.object({
  userId: z.string().min(1, { message: "User ID is required" }),
  productId: z.string().min(1, { message: "Product ID is required" }),
  rating: z
    .number({ invalid_type_error: "Rating must be a number" })
    .min(1)
    .max(5),
  comment: z.string().optional(),
});

const updateReviewSchema = createReviewSchema.partial();

export const createReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = createReviewSchema.parse(req.body);
    const review = await prisma.review.create({ data });
    res.status(201).json({ message: "Review created successfully", review });
  } catch (error) {
    next(error);
  }
};

export const updateReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const data = updateReviewSchema.parse(req.body);
    const review = await prisma.review.update({ where: { id }, data });
    res.status(200).json({ message: "Review updated successfully", review });
  } catch (error) {
    next(error);
  }
};

export const getReviewById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const review = await prisma.review.findUnique({ where: { id } });
    if (!review) {
      res.status(404).json({ message: "Review not found" });
      return;
    }
    res.status(200).json({ message: "Review retrieved successfully", review });
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const review = await prisma.review.delete({ where: { id } });
    res.status(200).json({ message: "Review deleted successfully", review });
  } catch (error) {
    next(error);
  }
};

export const getReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const reviews = await prisma.review.findMany();

    res
      .status(200)
      .json({ message: "Reviews retrieved successfully", reviews });
  } catch (error) {
    next(error);
  }
};
