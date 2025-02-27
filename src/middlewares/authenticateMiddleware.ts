import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { z, ZodError } from "zod";

// Extend the Express Request type with an optional "user" property.
export interface AuthenticatedRequest extends Request {
  user?: { id: string; role?: string };
}

// Define a schema for the token
const tokenSchema = z.string().nonempty("Token must be a non-empty string");

export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  // Expecting the token to be provided in the Authorization header as "Bearer <token>"
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ message: "Authorization header missing" });
    return;
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    res.status(401).json({ message: "Invalid authorization header format" });
    return;
  }

  const token = parts[1];
  //console.log("*** token ***", token);

  try {
    // Validate the token format using zod (optional)
    tokenSchema.parse(token);

    let decoded: unknown;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
      //console.log("*** decoded ***", JSON.stringify(decoded, null, 2));
    } catch (verifyError: any) {
      res.status(401).json({ message: "Invalid or expired token" });
      return;
    }

    // Assuming the JWT payload has an "id" and optionally a "role" property.
    if (typeof decoded === "object" && decoded?.hasOwnProperty("id")) {
      req.user = { id: (decoded as any).id, role: (decoded as any).role };
      next();
    } else {
      res.status(401).json({ message: "Invalid token payload" });
      return;
    }
  } catch (error: any) {
    // Handle errors from tokenSchema.parse or any unexpected issues
    next(error);
  }
};
