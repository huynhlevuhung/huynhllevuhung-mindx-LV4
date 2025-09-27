// routes/productVariantRoutes.js
import { Router } from "express";
import productVariantController from "../controllers/productVariantController.js";
import { protect, restrictTo } from "../middlewares/authMiddleware.js";

const router = Router();

// CREATE (chỉ seller hoặc admin mới được thêm variant)
router.post(
  "/",
  protect,
  restrictTo("seller", "admin"),
  productVariantController.createVariant
);

// READ - tất cả variants của 1 product
router.get(
  "/product/:productId",
  productVariantController.getVariantsByProduct
);

// READ - 1 variant theo ID
router.get("/:id", productVariantController.getVariant);

// UPDATE (seller hoặc admin)
router.put(
  "/:id",
  protect,
  restrictTo("seller", "admin"),
  productVariantController.updateVariant
);

// DELETE (seller hoặc admin)
router.delete(
  "/:id",
  protect,
  restrictTo("seller", "admin"),
  productVariantController.deleteVariant
);

export default router;
