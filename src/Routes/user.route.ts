import express from "express";
import { getUserRegistrationStats } from "../controllers/user.controller";
import { isAuthenticated, isAdmin } from "../middlewares/auth";

const router = express.Router();

// ... existing routes ...

// Get user registration statistics (admin only)
router.get("/stats/registrations", isAuthenticated, isAdmin, getUserRegistrationStats);

export default router; 