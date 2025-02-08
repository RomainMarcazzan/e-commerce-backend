import jwt from "jsonwebtoken";
import prisma from "../lib/prisma";
import { Request, Response } from "express";

export const register = async (req: Request, res: Response) => {
  // Extract user details from request body
  const { firstName, lastName, email, password, phoneNumber } = req.body;
  try {
    // Create a new user (note: add password hashing in production)
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password,
        phoneNumber,
      },
    });
    // Generate tokens
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
    // Create a session
    await prisma.session.create({
      data: {
        userId: user.id,
        refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });
    res.json({ accessToken, refreshToken });
  } catch (error) {
    res.status(500).json({ error: "Registration failed" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || password !== user.password) {
      // Replace with proper hashed password check in production
      return res.status(401).json({ error: "Invalid credentials" });
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
    res.json({ accessToken, refreshToken });
  } catch (error) {
    return res.status(500).json({ error: "Login failed" });
  }
};

export const refresh = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (!refreshToken)
    return res.status(400).json({ error: "Refresh token required" });
  try {
    // Cast payload to jwt.JwtPayload to safely access properties
    const payload = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET!
    ) as jwt.JwtPayload;
    const session = await prisma.session.findUnique({
      where: { refreshToken },
    });
    if (!session) return res.status(403).json({ error: "Invalid session" });
    const newAccessToken = jwt.sign(
      { id: payload.id, role: payload.role },
      process.env.JWT_SECRET!,
      { expiresIn: "15m" }
    );
    res.json({ accessToken: newAccessToken });
  } catch (error) {
    // Changed error status to 403 (Forbidden)
    res.status(403).json({ error: "Invalid refresh token" });
  }
};

export const logout = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (!refreshToken)
    return res.status(400).json({ error: "Refresh token required" });
  try {
    // Remove the session associated with the refresh token
    await prisma.session.delete({
      where: { refreshToken },
    });
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: "Logout failed" });
  }
};
