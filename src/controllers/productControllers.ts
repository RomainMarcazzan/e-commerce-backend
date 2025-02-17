import { NextFunction, Response, Request } from "express";
import { z } from "zod";
import prisma from "../lib/prisma";
import multer from "multer";
import path from "path";
import fs from "fs";

const createProductSchema = z.object({
  name: z.string().min(1, { message: "Product name is required" }),
  description: z
    .string()
    .min(1, { message: "Product description is required" }),
  price: z.number({ invalid_type_error: "Price must be a number" }),
  stock: z.number({ invalid_type_error: "Stock must be a number" }),
  categoryId: z.string().min(1, { message: "Category ID is required" }),
});

const updateProductSchema = createProductSchema.partial();

const getProductsQuerySchema = z.object({
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(10),
});

const allowedMimeTypes = ["image/jpeg", "image/png"];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../../uploads");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const extension = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${extension}`);
  },
});

export const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      // Casting the error as any to satisfy TypeScript
      cb(new Error("Invalid file type") as any, false);
    }
  },
});

// Schema for a multer file (add other fields as needed)
const multerFileSchema = z.object({
  filename: z.string(),
  originalname: z.string(),
  mimetype: z.string(), // new field added for mimetype validation
  // ...other fields if necessary...
});

// Combined schema for product creation input with req.body and req.files
const createProductInputSchema = z.object({
  body: createProductSchema,
  files: z.preprocess(
    (val) => (Array.isArray(val) ? val : []),
    z.array(multerFileSchema)
  ),
});

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { body, files } = createProductInputSchema.parse({
      body: req.body,
      files: req.files,
    });
    const product = await prisma.product.create({
      data: {
        ...body,
        images: {
          create: files.map((file) => ({
            url: `/uploads/${file.filename}`,
          })),
        },
      },
    });
    res.status(201).json({ message: "Product created successfully", product });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const data = updateProductSchema.parse(req.body);
    const files = Array.isArray(req.files) ? req.files : []; // Ensure files is defined
    const product = await prisma.product.update({
      where: { id },
      data: {
        ...data,
        images: {
          create: files.map((file: Express.Multer.File) => ({
            url: `/uploads/${file.filename}`,
          })),
        },
      },
    });

    res.status(200).json({ message: "Product updated successfully", product });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res
      .status(200)
      .json({ message: "Product retrieved successfully", product });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.delete({ where: { id } });
    res.status(200).json({ message: "Product deleted successfully", product });
  } catch (error) {
    next(error);
  }
};

export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page, limit } = getProductsQuerySchema.parse(req.query);
    const skip = (page - 1) * limit;
    const products = await prisma.product.findMany({ skip, take: limit });
    res
      .status(200)
      .json({ message: "Products retrieved successfully", products });
  } catch (error) {
    next(error);
  }
};
