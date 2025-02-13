import jwt from "jsonwebtoken";
import prisma from "../lib/prisma";
import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { z } from "zod";
import { generateRandomResetCode } from "../utils/generateRandomResetCode";

const registerSchema = z.object({
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

const loginSchema = z.object({
  email: z.string().email({ message: "Provide a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(1, { message: "Refresh token required" }),
});

const logoutSchema = z.object({
  refreshToken: z.string().min(1, { message: "Refresh token required" }),
});

const lostEmailSchema = z.object({
  email: z.string().email({ message: "Provide a valid email address" }),
});

const lostCodeSchema = z.object({
  email: z.string().email({ message: "Provide a valid email address" }),
  reset_code: z.string(),
  password: z.string(),
});

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { firstName, lastName, email, password, phoneNumber } =
      registerSchema.parse(req.body);
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        phoneNumber,
      },
    });
    const accessToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "15m" }
    );
    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: "7d" }
    );
    await prisma.session.create({
      data: {
        userId: user.id,
        refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });
    res.status(201).json({ accessToken, refreshToken });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }
    const accessToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "15m" }
    );
    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: "7d" }
    );
    await prisma.session.create({
      data: {
        userId: user.id,
        refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });
    res.status(200).json({ accessToken, refreshToken });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { refreshToken } = refreshSchema.parse(req.body);
    const payload = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET!
    ) as jwt.JwtPayload;
    const session = await prisma.session.findUnique({
      where: { refreshToken },
    });
    if (!session) {
      res.status(403).json({ error: "Invalid session" });
      return;
    }
    const newAccessToken = jwt.sign(
      { id: payload.id, role: payload.role },
      process.env.JWT_SECRET!,
      { expiresIn: "15m" }
    );
    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    next(error);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { refreshToken } = logoutSchema.parse(req.body);
    await prisma.session.delete({ where: { refreshToken } });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

export const lostEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = lostEmailSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const code = generateRandomResetCode();
    res.status(200).json({ message: "Email sent", success: true, code });
  } catch (error) {
    next(error);
  }
};

export const lostCode = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { reset_code, password, email } = lostCodeSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email, reset_code } });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword, reset_code: null },
    });
    res
      .status(200)
      .json({ message: "Password reset successfully", success: true });
  } catch (error) {
    next(error);
  }
};
