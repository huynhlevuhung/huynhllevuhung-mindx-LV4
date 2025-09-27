import Image from "../models/ImageModel.js";
import Product from "../models/ProductModel.js";
import Color from "../models/ColorModel.js";

// CREATE
export const createImage = async (req, res) => {
  try {
    const { productId, colorId, url, is_primary } = req.body;

    if (!productId || !url) {
      return res.status(400).json({ message: "Product ID và URL là bắt buộc" });
    }

    // Kiểm tra product tồn tại
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product không tồn tại" });

    // Kiểm tra color nếu có
    if (colorId) {
      const color = await Color.findById(colorId);
      if (!color) return res.status(404).json({ message: "Color không tồn tại" });
    }

    const image = await Image.create({
      product: productId,
      color: colorId || null,
      url,
      is_primary: is_primary || false,
    });

    res.status(201).json({ message: "Image created successfully", data: image });
  } catch (error) {
    res.status(500).json({ message: "Error creating image", error: error.message });
  }
};

// READ - all images
export const getAllImages = async (req, res) => {
  try {
    const images = await Image.find()
      .populate("product", "name")
      .populate("color", "name hex_code");

    res.status(200).json({ message: "Success", data: images });
  } catch (error) {
    res.status(500).json({ message: "Error fetching images", error: error.message });
  }
};

// READ - single image
export const getImage = async (req, res) => {
  try {
    const { id } = req.params;
    const image = await Image.findById(id)
      .populate("product", "name")
      .populate("color", "name hex_code");

    if (!image) return res.status(404).json({ message: "Image not found" });

    res.status(200).json({ message: "Success", data: image });
  } catch (error) {
    res.status(500).json({ message: "Error fetching image", error: error.message });
  }
};

// UPDATE
export const updateImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { productId, colorId, url, is_primary } = req.body;

    const image = await Image.findById(id);
    if (!image) return res.status(404).json({ message: "Image not found" });

    // Update product nếu có
    if (productId) {
      const product = await Product.findById(productId);
      if (!product) return res.status(404).json({ message: "Product không tồn tại" });
      image.product = productId;
    }

    // Update color nếu có
    if (colorId) {
      const color = await Color.findById(colorId);
      if (!color) return res.status(404).json({ message: "Color không tồn tại" });
      image.color = colorId;
    }

    if (url) image.url = url;
    if (typeof is_primary !== "undefined") image.is_primary = is_primary;

    await image.save();

    res.status(200).json({ message: "Image updated successfully", data: image });
  } catch (error) {
    res.status(500).json({ message: "Error updating image", error: error.message });
  }
};

// DELETE
export const deleteImage = async (req, res) => {
  try {
    const { id } = req.params;
    const image = await Image.findByIdAndDelete(id);

    if (!image) return res.status(404).json({ message: "Image not found" });

    res.status(200).json({ message: "Image deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting image", error: error.message });
  }
};

export default {
  createImage,
  getAllImages,
  getImage,
  updateImage,
  deleteImage,
};
