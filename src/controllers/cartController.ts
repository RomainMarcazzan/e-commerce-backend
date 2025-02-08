import { Request, Response } from "express";
import prisma from "../lib/prisma";

// Get a user's cart
export const getCart = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: true },
    });
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch cart" });
  }
};

// Add an item to a user's cart
export const addItemToCart = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { productId, quantity } = req.body;
    // Either create a new cart or add item to existing cart
    let cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId, items: { create: { productId, quantity } } },
        include: { items: true },
      });
    } else {
      cart = await prisma.cart.update({
        where: { userId },
        data: { items: { create: { productId, quantity } } },
        include: { items: true },
      });
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: "Failed to add item to cart" });
  }
};

// Update a cart item
export const updateCartItem = async (req: Request, res: Response) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;
    const item = await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: "Failed to update cart item" });
  }
};

// Remove an item from a user's cart
export const removeCartItem = async (req: Request, res: Response) => {
  try {
    const { itemId } = req.params;
    const item = await prisma.cartItem.delete({ where: { id: itemId } });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: "Failed to remove cart item" });
  }
};
