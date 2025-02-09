import { NextFunction, Response, Request } from "express";
import { z } from "zod";
import prisma from "../lib/prisma";
import { AuthenticatedRequest } from "../middlewares/authenticateMiddleware";

const addCartItemSchema = z.object({
  productId: z.string().min(1, { message: "Product ID is required" }),
  quantity: z.number({ invalid_type_error: "Quantity must be a number" }),
});

const updateCartItemSchema = z.object({
  quantity: z.number({ invalid_type_error: "Quantity must be a number" }),
});

export const getCart = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } },
    });
    if (!cart) {
      res.status(404).json({ message: "Cart not found" });
      return;
    }
    res.status(200).json({
      message: "Cart retrieved successfully",
      cart: cart,
    });
  } catch (error) {
    next(error);
  }
};

export const addCartItem = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }
    const data = addCartItemSchema.parse(req.body);

    let cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      cart = await prisma.cart.create({ data: { userId } });
    }

    const existingItem = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId: data.productId },
    });

    let cartItem;
    if (existingItem) {
      cartItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + data.quantity },
      });
    } else {
      cartItem = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: data.productId,
          quantity: data.quantity,
        },
      });
    }

    res.status(201).json({ message: "Cart item added successfully", cartItem });
  } catch (error) {
    next(error);
  }
};

export const updateCartItem = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }
    const { id } = req.params;
    const data = updateCartItemSchema.parse(req.body);

    // Verify cart item belongs to user's cart
    const cartItem = await prisma.cartItem.findUnique({ where: { id } });
    if (!cartItem) {
      res.status(404).json({ message: "Cart item not found" });
      return;
    }
    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart || cart.id !== cartItem.cartId) {
      res.status(404).json({ message: "Access denied" });
      return;
    }

    const updatedItem = await prisma.cartItem.update({
      where: { id },
      data: { quantity: data.quantity },
    });
    res.status(200).json({
      message: "Cart item updated successfully",
      cartItem: updatedItem,
    });
  } catch (error) {
    next(error);
  }
};

export const removeCartItem = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }
    const { id } = req.params;
    const cartItem = await prisma.cartItem.findUnique({ where: { id } });
    if (!cartItem) {
      res.status(404).json({ message: "Cart item not found" });
      return;
    }
    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart || cart.id !== cartItem.cartId) {
      res.status(404).json({ message: "Access denied" });
      return;
    }

    const deletedItem = await prisma.cartItem.delete({ where: { id } });
    res.status(200).json({
      message: "Cart item removed successfully",
      cartItem: deletedItem,
    });
  } catch (error) {
    next(error);
  }
};

export const clearCart = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }
    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      res.status(404).json({ message: "Cart not found" });
      return;
    }
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    next(error);
  }
};
