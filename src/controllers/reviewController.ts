import { Request, Response } from "express";
import prisma from "../lib/prisma";

// Get all reviews
export const getReviews = async (req: Request, res: Response) => {
  try {
    const reviews = await prisma.review.findMany();
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
};

// Get a single review by id
export const getReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const review = await prisma.review.findUnique({ where: { id } });
    res.json(review);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch review" });
  }
};

// Create a new review
export const createReview = async (req: Request, res: Response) => {
  try {
    const { userId, productId, rating, comment } = req.body;
    const review = await prisma.review.create({
      data: { userId, productId, rating, comment },
    });
    res.json(review);
  } catch (error) {
    res.status(500).json({ error: "Failed to create review" });
  }
};

// Update an existing review
export const updateReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const review = await prisma.review.update({
      where: { id },
      data,
    });
    res.json(review);
  } catch (error) {
    res.status(500).json({ error: "Failed to update review" });
  }
};

// Delete a review
export const deleteReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const review = await prisma.review.delete({ where: { id } });
    res.json(review);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete review" });
  }
};
