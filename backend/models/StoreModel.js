import mongoose from "mongoose";

const storeSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: { type: String, required: true },
  address: { type: String, required: true },
  area: { type: mongoose.Schema.Types.ObjectId, ref: "Area", required: true },
  status: {
    type: String,
    enum: ["active", "inactive", "pending"],
    default: "pending",
  },
}, { timestamps: { createdAt: "created_at" } });

const StoreModel = mongoose.model("Store", storeSchema);
export default StoreModel;
