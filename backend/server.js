import dotenv from "dotenv";
import express from "express";
import connectMongoDB from "./db/connectMongoDB.js";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use("/api", authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectMongoDB();
});
