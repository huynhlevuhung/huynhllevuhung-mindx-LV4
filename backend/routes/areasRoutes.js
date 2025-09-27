import { Router } from "express";
import areaController from "../controllers/areaController.js";
import { protect, restrictTo } from "../middlewares/authMiddleware.js";

const router = Router();

// Tạo khu vực (chỉ admin)
router.post("/", protect, restrictTo("admin"), areaController.createArea);

// Lấy tất cả khu vực
router.get("/", areaController.getAllAreas);

// Lấy 1 khu vực theo id
router.get("/:id", areaController.getArea);

// Cập nhật khu vực (chỉ admin)
router.put("/:id", protect, restrictTo("admin"), areaController.updateArea);

// Xóa khu vực (chỉ admin)
router.delete("/:id", protect, restrictTo("admin"), areaController.deleteArea);

export default router;
