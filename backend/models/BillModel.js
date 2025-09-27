import mongoose from "mongoose";

const billSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "paid", "shipped", "completed", "cancelled"],
      default: "pending",
    },
    total_amount: {
      type: Number,
      default: 0,
    },
    final_amount: {
      type: Number,
      default: 0,
    },
    promotion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Promotion",
      default: null,
    },
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },
    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);



const Bill = mongoose.model("Bill", billSchema);
export default Bill;
