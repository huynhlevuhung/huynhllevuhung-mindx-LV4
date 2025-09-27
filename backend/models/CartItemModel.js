import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
  {
    cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
      required: true,
    },
    variant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductVariant",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number, // snapshot giá tại thời điểm add-to-cart
      required: true,
      min: 0,
    },
    promotion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Promotion",
      default: null,
    },
  },
  { timestamps: true }
);

const CartItem = mongoose.model("CartItem", cartItemSchema);
export default CartItem;
