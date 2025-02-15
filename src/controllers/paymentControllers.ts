import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import prisma from "../lib/prisma";

// Define schemas for Payment
const createPaymentSchema = z.object({
  orderId: z.string().min(1, { message: "Order ID is required" }),
  amount: z.number({ invalid_type_error: "Amount must be a number" }),
  method: z.literal("CARD"), // Changed from z.string().min(1, { message: "Payment method is required" })
  stripePaymentIntentId: z.string().optional(),
  stripePaymentMethodId: z.string().optional(),
});

const updatePaymentSchema = createPaymentSchema.partial();

// Query schema for pagination in payments
const getPaymentsQuerySchema = z.object({
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(10),
});

export const createPayment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = createPaymentSchema.parse(req.body);
    const payment = await prisma.payment.create({ data });
    res.status(201).json({ message: "Payment created successfully", payment });
  } catch (error) {
    next(error);
  }
};

export const updatePayment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const data = updatePaymentSchema.parse(req.body);
    const payment = await prisma.payment.update({ where: { id }, data });
    res.status(200).json({ message: "Payment updated successfully", payment });
  } catch (error) {
    next(error);
  }
};

export const getPaymentById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const payment = await prisma.payment.findUnique({ where: { id } });
    if (!payment) {
      res.status(404).json({ message: "Payment not found" });
      return;
    }
    res
      .status(200)
      .json({ message: "Payment retrieved successfully", payment });
  } catch (error) {
    next(error);
  }
};

export const deletePayment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const payment = await prisma.payment.delete({ where: { id } });
    res.status(200).json({ message: "Payment deleted successfully", payment });
  } catch (error) {
    next(error);
  }
};

export const getPayments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page, limit } = getPaymentsQuerySchema.parse(req.query);
    const skip = (page - 1) * limit;
    const payments = await prisma.payment.findMany({
      skip,
      take: limit,
    });
    res
      .status(200)
      .json({ message: "Payments retrieved successfully", payments });
  } catch (error) {
    next(error);
  }
};
