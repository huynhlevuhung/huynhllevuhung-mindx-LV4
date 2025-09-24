const Product = require("../models/Product");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

// CREATE product
exports.createProduct = catchAsync(async (req, res, next) => {
  const newProduct = await Product.create(req.body);

  res.status(201).json({
    status: "success",
    data: { product: newProduct },
  });
});

// GET ALL products
exports.getAllProducts = catchAsync(async (req, res, next) => {
  const products = await Product.find();

  res.status(200).json({
    status: "success",
    results: products.length,
    data: { products },
  });
});

// GET ONE product
exports.getProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new AppError("Không tìm thấy sản phẩm", 404));
  }

  res.status(200).json({
    status: "success",
    data: { product },
  });
});

// UPDATE product
exports.updateProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    return next(new AppError("Không tìm thấy sản phẩm", 404));
  }

  res.status(200).json({
    status: "success",
    data: { product },
  });
});

// DELETE product
exports.deleteProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    return next(new AppError("Không tìm thấy sản phẩm", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

// UPDATE product images
exports.updateProductImages = catchAsync(async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return next(new AppError("Chưa chọn file ảnh", 400));
  }

  // Lấy danh sách file vừa upload
  const images = req.files.map((file) => file.filename);

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { $push: { img: { $each: images } } }, // thêm nhiều ảnh vào mảng
    { new: true, runValidators: true }
  );

  if (!product) {
    return next(new AppError("Không tìm thấy sản phẩm", 404));
  }

  res.status(200).json({
    status: "success",
    data: { product },
  });
});
