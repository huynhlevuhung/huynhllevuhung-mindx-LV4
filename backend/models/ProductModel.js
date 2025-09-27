import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true }, // tương ứng name trong bảng
  description: { type: String, required: true },
  base_price: { type: Number, required: true },
  sale_price: { type: Number, default: null }, // nullable
  store: { type: mongoose.Schema.Types.ObjectId, ref: "Store", required: true },
  tag: { type: mongoose.Schema.Types.ObjectId, ref: "Tag" }, // 1 tag
  img: [{ type: String }], // danh sách ảnh
  quantity: { type: Number, default: 0 },
  totalRating: { type: Number, default: 0 },
  rate_counting: { type: Number, default: 0 },
  traded_count: { type: Number, default: 0 },
  onDeploy: { type: Boolean, default: true },
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  toJSON: { virtuals: true },
});

// Virtual: curRating
productSchema.virtual("curRating").get(function () {
  return this.rate_counting === 0 ? 0 : this.totalRating / this.rate_counting;
});

const ProductModel = mongoose.model("Product", productSchema);
export default ProductModel;
