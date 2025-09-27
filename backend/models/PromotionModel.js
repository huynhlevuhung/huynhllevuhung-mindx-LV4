// models/PromotionModel.js
import mongoose from "mongoose";

const promotionSchema = new mongoose.Schema(
  {
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true, // tránh khoảng trắng thừa
    },
    scope: {
      type: String,
      enum: ["order", "product"], // áp dụng cho toàn đơn hay theo sản phẩm
      required: true,
    },
    discount_type: {
      type: String,
      enum: ["percent", "fixed"], // sửa percentage -> percent
      required: true,
    },
    discount_value: {
      type: Number,
      required: true,
      min: 0,
    },
    start_date: {
      type: Date,
      required: true,
    },
    end_date: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return value > this.start_date; // end_date phải sau start_date
        },
        message: "End date must be after start date",
      },
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const PromotionModel = mongoose.model("Promotion", promotionSchema);
export default PromotionModel;
