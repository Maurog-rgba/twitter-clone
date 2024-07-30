import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import connectMongoDB from "./db/connectMongoDB.js";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const BASE_URL = process.env.BASE_URL;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api", authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on ${BASE_URL}:${PORT}`);
  connectMongoDB();
});
