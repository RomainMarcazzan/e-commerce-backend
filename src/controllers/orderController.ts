import { Request, Response } from "express";
import prisma from "../lib/prisma";

// Get all orders
export const getOrders = async (req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({ include: { items: true } });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

// Get a single order by id
export const getOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch order" });
  }
};

// Create a new order
export const createOrder = async (req: Request, res: Response) => {
  try {
    const { userId, items, totalPrice } = req.body;
    const order = await prisma.order.create({
      data: { userId, totalPrice, items: { create: items } },
      include: { items: true },
    });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Failed to create order" });
  }
};

// Update an order (e.g. status update)
export const updateOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const order = await prisma.order.update({ where: { id }, data });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Failed to update order" });
  }
};

// Delete an order
export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const order = await prisma.order.delete({ where: { id } });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete order" });
  }
};
