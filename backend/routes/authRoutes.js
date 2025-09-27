import express from "express";
import authController from "../controllers/authController.js";

const router = express.Router();

// Lấy thông tin user hiện tại
router.get("/me", authController.protect, authController.getMe);

export default router;
