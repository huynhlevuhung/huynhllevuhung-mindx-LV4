import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bill", // Bill = bảng orders cũ
      required: true,
    },
    variant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductVariant",
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    promotion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Promotion",
      default: null,
    },
    discount_amount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const OrderItem = mongoose.model("OrderItem", orderItemSchema);
export default OrderItem;
