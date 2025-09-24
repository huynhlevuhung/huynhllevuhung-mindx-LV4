import mongoose from "mongoose";

const tagSchema = new mongoose.Schema({
    nameTag: { type: String, required: true },
    quantity: { type: Number, default: 0 }
});

const TagModel = mongoose.model("Tag", tagSchema);
export default TagModel;
