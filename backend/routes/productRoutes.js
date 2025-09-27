import { Router } from "express";
import productController from "../controllers/productController.js";
import { protect, restrictTo } from "../middlewares/authMiddleware.js";

const router = Router();

// ---------------- CREATE ----------------
// Chỉ seller mới tạo được sản phẩm
router.post("/", protect, restrictTo("seller"), productController.createProduct);

// ---------------- READ ----------------
// Lấy tất cả sản phẩm (có phân trang)
router.get("/", productController.getAllProducts);

// Lấy sản phẩm theo ID
router.get("/:id", productController.getOneProduct);

// Lấy sản phẩm theo tag
router.get("/tag/:tagId", productController.getProductsByTag);

// Lọc sản phẩm theo khoảng giá
router.get("/price/range", productController.getProductsByPriceRange);

// Lấy sản phẩm theo store
router.get("/store/:storeId", productController.getProductsByStore);

// Top sản phẩm được mua nhiều nhất
router.get("/most-favourite", productController.getMostFavouriteProducts);

// Top sản phẩm theo đánh giá
router.get("/top-rating", productController.getTopRatingProducts);

// Tìm kiếm theo từ khóa (dropdown search)
router.get("/search", productController.searchByName);

// ---------------- UPDATE ----------------
// Chỉ seller (chủ sản phẩm) hoặc admin mới update được
router.put("/:id", protect, restrictTo("seller", "admin"), productController.updateProduct);

// ---------------- DELETE ----------------
// Chỉ seller (chủ sản phẩm) hoặc admin mới xóa được
router.delete("/:id", protect, restrictTo("seller", "admin"), productController.deleteProduct);

export default router;
