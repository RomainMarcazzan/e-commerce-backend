import express, { Request, Response } from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";

const app = express();
app.use(cors());

app.use(express.json());

app.get("/v1/health", async (req: Request, res: Response) => {
  res.send("API is running");
});

// Mount routes
app.use("/v1/auth", authRoutes);
app.use("/v1/users", userRoutes);
// ...additional routes and middleware...

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
