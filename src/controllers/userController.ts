import { Request, Response } from "express";
import prisma from "../lib/prisma"; // Updated to use global instance

export const getUsers = async (req: Request, res: Response) => {
  // Example: retrieve users from database
  const users = await prisma.user.findMany();
  res.json(users);
};

export const createUser = async (req: Request, res: Response) => {
  // Example: create a new user using request body
  const { email, name } = req.body;
  const user = await prisma.user.create({
    data: { email, name },
  });
  res.json(user);
};
