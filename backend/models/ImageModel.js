import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    color: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Color",
      default: null, // ảnh có thể không gắn màu cụ thể
    },
    is_primary: {
      type: Boolean,
      default: false, // đánh dấu ảnh chính để hiển thị thumbnail
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    collection: "images",
  }
);

const ImageModel = mongoose.model("Image", imageSchema);
export default ImageModel;
