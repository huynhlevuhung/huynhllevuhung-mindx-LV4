import { Router } from "express";
import sizeController from "../controllers/sizeController.js";
import { protect, restrictTo } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/", protect, restrictTo("admin"), sizeController.createSize);
router.get("/", sizeController.getAllSizes);
router.get("/:id", sizeController.getSize); // ✅ đúng tên với controller
router.put("/:id", protect, restrictTo("admin"), sizeController.updateSize);
router.delete("/:id", protect, restrictTo("admin"), sizeController.deleteSize);

export default router;
