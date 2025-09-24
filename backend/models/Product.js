const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema({
  quantity: {
    type: Number,
    required: true,
    default: 0,
  },
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // hoặc "Store" nếu bạn có collection riêng cho store
    required: true,
  },
  totalRating: {
    type: Number,
    default: 0,
  },
  rate_counting: {
    type: Number,
    default: 0,
  },
  traded_count: {
    type: Number,
    default: 0,
  },
  onDeploy: {
    type: Boolean,
    default: true,
  },
});

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: [true, "Tên sản phẩm không được để trống"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Giá sản phẩm không được để trống"],
      min: [0, "Giá phải lớn hơn 0"],
    },
    img: {
      type: [String], // mảng ảnh
      default: [],
    },
    tags: [tagSchema],
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
