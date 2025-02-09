import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import prisma from "../lib/prisma";
import { OrderStatus } from "@prisma/client";

const orderStatusSchema = z.nativeEnum(OrderStatus);

const createOrderItemSchema = z.object({
  productId: z.string().min(1, { message: "Product ID is required" }),
  quantity: z.number({ invalid_type_error: "Quantity must be a number" }),
  price: z.number({ invalid_type_error: "Price must be a number" }),
});

const createOrderSchema = z.object({
  userId: z.string().min(1, { message: "User ID is required" }),
  totalPrice: z.number({ invalid_type_error: "Total price must be a number" }),
  status: orderStatusSchema.optional(),
  items: z.array(createOrderItemSchema).optional(),
});

// For update, we remove items because nested updates require separate handling.
const updateOrderSchema = z.object({
  totalPrice: z
    .number({ invalid_type_error: "Total price must be a number" })
    .optional(),
  status: orderStatusSchema.optional(),
});

export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = createOrderSchema.parse(req.body);
    const { items, ...orderData } = data;
    const order = await prisma.order.create({
      data: {
        ...orderData,
        // Use nested create for items if provided
        items: items ? { create: items } : undefined,
      },
      include: { items: true, payment: true },
    });
    res.status(201).json({ message: "Order created successfully", order });
  } catch (error) {
    next(error);
  }
};

export const updateOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    // items are not updated here; updateOrderSchema excludes items
    const data = updateOrderSchema.parse(req.body);
    const order = await prisma.order.update({ where: { id }, data });
    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }
    res.status(200).json({ message: "Order updated successfully", order });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true, payment: true },
    });
    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }
    res.status(200).json({ message: "Order retrieved successfully", order });
  } catch (error) {
    next(error);
  }
};

export const deleteOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const order = await prisma.order.delete({ where: { id } });
    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }
    res.status(200).json({ message: "Order deleted successfully", order });
  } catch (error) {
    next(error);
  }
};

export const getOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const orders = await prisma.order.findMany({
      include: { items: true, payment: true },
    });

    res.status(200).json({ message: "Orders retrieved successfully", orders });
  } catch (error) {
    next(error);
  }
};
