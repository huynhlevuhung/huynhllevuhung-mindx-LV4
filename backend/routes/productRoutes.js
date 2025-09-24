const express = require("express");
const productController = require("../controllers/productController");
const authController = require("../controllers/authController");
const uploadProductImg = require("../middlewares/uploadProductImg");

const router = express.Router();

// Nếu muốn chỉ admin CRUD thì bật middleware này
// router.use(authController.protect, authController.restrictTo("admin"));

router
  .route("/")
  .get(productController.getAllProducts)   // GET /api/products
  .post(productController.createProduct);  // POST /api/products

router
  .route("/:id")
  .get(productController.getProduct)       // GET /api/products/:id
  .patch(productController.updateProduct)  // PATCH /api/products/:id
  .delete(productController.deleteProduct);// DELETE /api/products/:id

router
  .route("/:id/images")
  .patch(
    uploadProductImg.array("images", 5), // upload tối đa 5 ảnh
    productController.updateProductImages
  );


module.exports = router;
