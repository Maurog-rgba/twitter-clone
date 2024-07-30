import express from "express";
import { getMe, login, logout, signup } from "../controllers/auth.controller.js";
import { protectedRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/auth/me", protectedRoute, getMe);
router.post("/auth/signup", signup);
router.post("/auth/login", login);
router.post("/auth/logout", logout);

export default router;
