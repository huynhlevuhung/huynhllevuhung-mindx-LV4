const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema({
  nameTag: {
    type: String,
    required: [true, "Tên tag không được để trống"],
    unique: true,
    trim: true,
  },
  quantity: {
    type: Number,
    default: 0,
  },
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // hoặc "Store"
  },
  totalRating: { type: Number, default: 0 },
  rate_counting: { type: Number, default: 0 },
  traded_count: { type: Number, default: 0 },
  onDeploy: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model("Tag", tagSchema);
