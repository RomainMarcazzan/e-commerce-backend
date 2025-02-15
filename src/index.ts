import express, { Request, Response } from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";
import orderRoutes from "./routes/orderRoutes";
import cartRoutes from "./routes/cartRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import productRoutes from "./routes/productRoutes";
import reviewRoutes from "./routes/reviewRoutes";
import paymentRoutes from "./routes/paymentRoutes"; // New import
import { errorHandler } from "./middlewares/errorHandlerMiddleware";
import { setupSwagger } from "./config/swagger";

const app = express();
app.use(cors());

app.use(express.json());

app.get("/v1/health", async (req: Request, res: Response) => {
  res.send("API is running");
});

app.use("/v1/auth", authRoutes);
app.use("/v1/user", userRoutes);
app.use("/v1/order", orderRoutes);
app.use("/v1/cart", cartRoutes);
app.use("/v1/category", categoryRoutes);
app.use("/v1/product", productRoutes);
app.use("/v1/review", reviewRoutes);
app.use("/v1/payment", paymentRoutes); // Register payment routes

setupSwagger(app);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/v1/docs`);
});
