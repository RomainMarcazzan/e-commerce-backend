import { NextFunction, Response, Request } from "express";
import { z } from "zod";
import prisma from "../lib/prisma";
import { AuthenticatedRequest } from "../middlewares/authenticateMiddleware";

const updateUserSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: "First name is required" })
    .optional(),
  lastName: z.string().min(1, { message: "Last name is required" }).optional(),
  email: z
    .string()
    .email({ message: "Provide a valid email address" })
    .optional(),
  phoneNumber: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, {
      message: "Invalid phone number format, must be in E.164 format",
    })
    .optional(),
});

const createUserSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  email: z.string().email({ message: "Provide a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
  phoneNumber: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, {
      message: "Invalid phone number format, must be in E.164 format",
    })
    .optional(),
});

const getUsersQuerySchema = z.object({
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(10),
});

export const updateUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  if (!id) {
    res.status(401).json({ message: "User not authenticated" });
    return;
  }
  try {
    const data = updateUserSchema.parse(req.body);
    const updatedUser = await prisma.user.update({
      where: { id: id },
      data,
    });
    const { password, ...userWithoutPassword } = updatedUser;
    res.status(200).json({
      message: "User updated successfully",
      user: userWithoutPassword,
    });
  } catch (error) {
    next(error);
  }
};

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = createUserSchema.parse(req.body);
    const newUser = await prisma.user.create({ data });
    const { password, ...userWithoutPassword } = newUser;
    res.status(201).json({
      message: "User created successfully",
      user: userWithoutPassword,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const { password, ...userWithoutPassword } = user;
    res.status(200).json({
      message: "User retrieved successfully",
      user: userWithoutPassword,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const deletedUser = await prisma.user.delete({ where: { id } });
    if (!deletedUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const { password, ...userWithoutPassword } = deletedUser;
    res.status(200).json({
      message: "User deleted successfully",
      user: userWithoutPassword,
    });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page, limit } = getUsersQuerySchema.parse(req.query);
    const skip = (page - 1) * limit;
    const users = await prisma.user.findMany({ skip, take: limit });
    const usersWithoutPassword = users.map(({ password, ...rest }) => rest);
    res.status(200).json({
      message: "Users retrieved successfully",
      users: usersWithoutPassword,
    });
  } catch (error) {
    next(error);
  }
};
