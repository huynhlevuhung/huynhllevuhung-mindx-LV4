// controllers/productVariantController.js
import ProductVariant from "../models/ProductVariantModel.js";
import Product from "../models/ProductModel.js";
import Color from "../models/ColorModel.js";
import Size from "../models/SizeModel.js";

// CREATE
export const createVariant = async (req, res) => {
  try {
    const { productId, colorId, sizeId, base_price, sale_price, quantity } = req.body;

    // Kiểm tra product, color, size tồn tại
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const color = await Color.findById(colorId);
    if (!color) return res.status(404).json({ message: "Color not found" });

    const size = await Size.findById(sizeId);
    if (!size) return res.status(404).json({ message: "Size not found" });

    // 🔍 Kiểm tra duplicate variant
    const existVariant = await ProductVariant.findOne({
      product: productId,
      color: colorId,
      size: sizeId,
    });
    if (existVariant) {
      return res.status(400).json({ message: "Variant already exists for this product" });
    }

    // Tạo variant mới
    const variant = await ProductVariant.create({
      product: productId,
      color: colorId,
      size: sizeId,
      base_price,
      sale_price: sale_price || null,
      quantity,
    });

    res.status(201).json({ message: "Variant created successfully", data: variant });
  } catch (error) {
    res.status(500).json({ message: "Error creating variant", error: error.message });
  }
};

// READ - tất cả variants của 1 product
export const getVariantsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const variants = await ProductVariant.find({ product: productId })
      .populate("product")
      .populate("color")
      .populate("size");

    res.status(200).json({ message: "Success", data: variants });
  } catch (error) {
    res.status(500).json({ message: "Error fetching variants", error: error.message });
  }
};

// READ - 1 variant theo ID
export const getVariant = async (req, res) => {
  try {
    const { id } = req.params;
    const variant = await ProductVariant.findById(id)
      .populate("product")
      .populate("color")
      .populate("size");

    if (!variant) return res.status(404).json({ message: "Variant not found" });

    res.status(200).json({ message: "Success", data: variant });
  } catch (error) {
    res.status(500).json({ message: "Error fetching variant", error: error.message });
  }
};

// UPDATE
export const updateVariant = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const variant = await ProductVariant.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!variant) return res.status(404).json({ message: "Variant not found" });

    res.status(200).json({ message: "Variant updated successfully", data: variant });
  } catch (error) {
    res.status(500).json({ message: "Error updating variant", error: error.message });
  }
};

// DELETE
export const deleteVariant = async (req, res) => {
  try {
    const { id } = req.params;
    const variant = await ProductVariant.findByIdAndDelete(id);

    if (!variant) return res.status(404).json({ message: "Variant not found" });

    res.status(200).json({ message: "Variant deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting variant", error: error.message });
  }
};

export default {
  createVariant,
  getVariantsByProduct,
  getVariant,
  updateVariant,
  deleteVariant,
};
