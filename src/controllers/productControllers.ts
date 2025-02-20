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
  price: z.coerce.number({ invalid_type_error: "Price must be a number" }), // Updated
  stock: z.coerce.number({ invalid_type_error: "Stock must be a number" }), // Updated
  categoryId: z.string().min(1, { message: "Category ID is required" }),
});

const updateProductSchema = createProductSchema.partial().extend({
  removedImageIds: z
    .preprocess(
      (val) => (typeof val === "string" ? [val] : val),
      z.array(z.string())
    )
    .optional(),
  imagesOrder: z
    .preprocess((val) => {
      if (Array.isArray(val)) {
        return val.map((item) =>
          typeof item === "string" ? JSON.parse(item) : item
        );
      }
      if (typeof val === "string") {
        return [JSON.parse(val)];
      }
      return val;
    }, z.array(z.object({ id: z.string(), order: z.number() })))
    .optional(),
});

const getProductsQuerySchema = z.object({
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(10),
  search: z.string().optional(), // <-- added search
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
      include: { images: true },
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
    const files = Array.isArray(req.files) ? req.files : [];

    // Process removed images if provided
    if (data.removedImageIds && data.removedImageIds.length > 0) {
      for (const imageId of data.removedImageIds) {
        const imageRecord = await prisma.productImage.findUnique({
          where: { id: imageId },
        });
        if (imageRecord) {
          const filePath = path.join(
            __dirname,
            "../../uploads",
            path.basename(imageRecord.url)
          );
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
          await prisma.productImage.delete({ where: { id: imageId } });
        }
      }
      delete data.removedImageIds;
    }

    // Destructure imagesOrder and categoryId from data so they're not spread into product update
    const { categoryId, imagesOrder, ...restData } = data;
    // Build update data: include new category connection if categoryId is provided
    const updateData = {
      ...restData,
      ...(categoryId ? { category: { connect: { id: categoryId } } } : {}),
      images: {
        create: files.map((file: Express.Multer.File) => ({
          url: `/uploads/${file.filename}`,
        })),
      },
    };

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
      include: { images: true },
    });

    // Process new image order if provided - update using "imageOrder" in product images
    if (imagesOrder && imagesOrder.length > 0) {
      for (const { id: imgId, order } of imagesOrder) {
        await prisma.productImage.update({
          where: { id: imgId },
          data: { imageOrder: order },
        });
      }
    }

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
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: { imageOrder: "asc" }, // updated sort field
        },
      },
    });
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
    // Include related images when deleting the product
    const product = await prisma.product.delete({
      where: { id },
      include: { images: true },
    });
    // Delete files from uploads folder
    for (const image of product.images) {
      const filePath = path.join(
        __dirname,
        "../../uploads",
        path.basename(image.url)
      );
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
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
    const { page, limit, search } = getProductsQuerySchema.parse(req.query);
    const skip = (page - 1) * limit;
    // Build filtering conditions: search in name or description.
    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { description: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {};
    const products = await prisma.product.findMany({
      where,
      skip,
      take: limit,
      include: { images: true },
    });
    res
      .status(200)
      .json({ message: "Products retrieved successfully", products });
  } catch (error) {
    next(error);
  }
};
