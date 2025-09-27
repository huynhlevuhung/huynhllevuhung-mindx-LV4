// routes/billRoutes.js
import { Router } from "express";
import billController from "../controllers/billController.js";
import { protect, restrictTo } from "../middlewares/authMiddleware.js";

const router = Router();

// Tạo bill mới (user)
router.post("/", protect, billController.createBill);

// Lấy tất cả bills
// - Admin thấy tất cả
// - User thường chỉ thấy bill của mình
router.get("/", protect, billController.getAllBills);

// Lấy chi tiết bill theo id
router.get("/:id", protect, billController.getBillById);

// Cập nhật trạng thái bill
// - Admin / Shipper mới được cập nhật
router.put("/:id/status", protect, billController.updateBillStatus);

// Xóa bill
// - Admin hoặc chủ bill (khi bill còn pending)
router.delete("/:id", protect, billController.deleteBill);

export default router;
