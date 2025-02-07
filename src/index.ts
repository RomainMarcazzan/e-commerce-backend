import express, { Request, Response } from "express";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";

const app = express();

app.use(express.json());

app.get("/", async (req: Request, res: Response) => {
  res.send("Hello from Express and Prisma");
});

// Mount routes
app.use("/users", userRoutes);
app.use("/auth", authRoutes);
// ...additional routes and middleware...

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
