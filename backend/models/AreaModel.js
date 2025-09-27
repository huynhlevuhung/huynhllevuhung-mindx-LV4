import mongoose from "mongoose";

const areaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true, // vì thường area không nên trùng tên
    },
  },
  {
    timestamps: false, // bảng gốc không có created_at/updated_at
  }
);

const AreaModel = mongoose.model("Area", areaSchema);
export default AreaModel;
