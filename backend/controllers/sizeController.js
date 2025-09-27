// controllers/sizeController.js
import Size from "../models/SizeModel.js";

// CREATE
export const createSize = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const size = await Size.create({ name });

    res.status(201).json({ message: "Size created successfully", data: size });
  } catch (error) {
    res.status(500).json({ message: "Error creating size", error: error.message });
  }
};

// READ - all sizes
export const getAllSizes = async (req, res) => {
  try {
    const sizes = await Size.find();
    res.status(200).json({ message: "Success", data: sizes });
  } catch (error) {
    res.status(500).json({ message: "Error fetching sizes", error: error.message });
  }
};

// READ - single size
export const getSize = async (req, res) => {
  try {
    const { id } = req.params;
    const size = await Size.findById(id);
    if (!size) return res.status(404).json({ message: "Size not found" });
    res.status(200).json({ message: "Success", data: size });
  } catch (error) {
    res.status(500).json({ message: "Error fetching size", error: error.message });
  }
};

// UPDATE
export const updateSize = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const size = await Size.findByIdAndUpdate(
      id,
      { name },
      { new: true, runValidators: true }
    );

    if (!size) return res.status(404).json({ message: "Size not found" });

    res.status(200).json({ message: "Size updated successfully", data: size });
  } catch (error) {
    res.status(500).json({ message: "Error updating size", error: error.message });
  }
};

// DELETE
export const deleteSize = async (req, res) => {
  try {
    const { id } = req.params;
    const size = await Size.findByIdAndDelete(id);

    if (!size) return res.status(404).json({ message: "Size not found" });

    res.status(200).json({ message: "Size deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting size", error: error.message });
  }
};

export default {
  createSize,
  getAllSizes,
  getSize,
  updateSize,
  deleteSize,
};
