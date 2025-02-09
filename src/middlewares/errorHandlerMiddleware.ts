import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { ZodError } from "zod";

export const errorHandler: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error("errorHandler", err);

  if (err instanceof ZodError) {
    res.status(400).json({ errors: err.errors });
    return;
  }

  res.status(500).json({ error: err.message || "Internal Server Error" });
};
