// routes/promotionRoutes.js
import { Router } from "express";
import {
  createPromotion,
  getPromotions,
  getPromotionById,
  updatePromotion,
  deletePromotion,
} from "../controllers/promotionController.js";
import { protect, restrictTo } from "../middlewares/authMiddleware.js";

const router = Router();

// ---------------- CREATE ----------------
// Seller hoặc Admin mới tạo được promotion
router.post("/", protect, restrictTo("seller", "admin"), createPromotion);

// ---------------- READ ----------------
// Lấy tất cả promotions (seller chỉ xem store của mình)
router.get("/", protect, getPromotions);

// Lấy chi tiết 1 promotion
router.get("/:id", protect, getPromotionById);

// ---------------- UPDATE ----------------
// Chỉ owner của store hoặc admin mới sửa
router.put("/:id", protect, restrictTo("seller", "admin"), updatePromotion);

// ---------------- DELETE ----------------
// Chỉ owner của store hoặc admin mới xóa
router.delete("/:id", protect, restrictTo("seller", "admin"), deletePromotion);

export default router;
