import { Router } from "express";
import storeController from "../controllers/storeController.js";
import { protect, restrictTo } from "../middlewares/authMiddleware.js";

const router = Router();

// Public
router.get("/", storeController.getAllStores);
router.get("/:id", storeController.getStoreInfo);

// Protected (chỉ seller/admin)
router.post("/", protect, restrictTo("seller", "admin"), storeController.createStore);
router.patch("/:id", protect, restrictTo("seller", "admin"), storeController.updateStore);
router.delete("/:id", protect, restrictTo("seller", "admin"), storeController.deleteStore);

export default router;
