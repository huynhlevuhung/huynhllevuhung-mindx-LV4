import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    productName: { type: String, required: true },
    price: { type: Number, required: true },
    img: [{ type: String, required: true }],
    tags: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tag'
        }
    ],
    quantity: { type: Number, required: true },
    store: { type: mongoose.Schema.Types.ObjectId, ref: "Store", required: false },
    totalRating: { type: Number, default: 0 },
    rate_counting: { type: Number, default: 0 },
    traded_count: { type: Number, default: 0 },
    onDeploy: { type: Boolean, default: true },
    description: { type: String, required: true }
}, {
    toJSON: { virtuals: true }   // đảm bảo trả API có curRating
    // toObject: { virtuals: true } // <- chỉ bật nếu bạn cần toObject() có virtual
});

// Virtual field
productSchema.virtual("curRating").get(function () {
    return this.rate_counting === 0
        ? 0
        : this.totalRating / this.rate_counting;
});

const ProductModel = mongoose.model("Product", productSchema);
export default ProductModel;
