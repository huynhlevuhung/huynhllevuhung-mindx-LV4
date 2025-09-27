import mongoose from "mongoose";

const productVariantSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    color: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Color",
      required: true,
    },
    size: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Size",
      required: true,
    },
    base_price: {
      type: Number,
      required: true,
      min: 0,
    },
    sale_price: {
      type: Number,
      default: null, // nullable
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: { createdAt: "created_at" },
  }
);

const ProductVariantModel = mongoose.model(
  "ProductVariant",
  productVariantSchema
);
export default ProductVariantModel;
