import mongoose from "mongoose";

const colorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    hex_code: {
      type: String,
      required: true,
      match: /^#([0-9A-Fa-f]{6})$/, // validate mã màu hex
    },
  },
  {
    timestamps: { createdAt: "created_at" },
  }
);

const ColorModel = mongoose.model("Color", colorSchema);
export default ColorModel;
