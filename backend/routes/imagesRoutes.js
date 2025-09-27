import { Router } from "express";
import imageController from "../controllers/imageController.js";
import { protect, restrictTo } from "../middlewares/authMiddleware.js";

const router = Router();

// CREATE
router.post("/", protect, restrictTo("admin"), imageController.createImage);

// READ
router.get("/", imageController.getAllImages);
router.get("/:id", imageController.getImage);

// UPDATE
router.put("/:id", protect, restrictTo("admin"), imageController.updateImage);

// DELETE
router.delete("/:id", protect, restrictTo("admin"), imageController.deleteImage);

export default router;
