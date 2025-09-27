// controllers/colorController.js
import Color from "../models/ColorModel.js";

// CREATE
export const createColor = async (req, res) => {
  try {
    const { name, hex_code } = req.body;

    if (!name || !hex_code) {
      return res.status(400).json({ message: "Name and hex_code are required" });
    }

    const color = await Color.create({ name, hex_code });

    res.status(201).json({ message: "Color created successfully", data: color });
  } catch (error) {
    res.status(500).json({ message: "Error creating color", error: error.message });
  }
};

// READ - all colors
export const getAllColors = async (req, res) => {
  try {
    const colors = await Color.find();
    res.status(200).json({ message: "Success", data: colors });
  } catch (error) {
    res.status(500).json({ message: "Error fetching colors", error: error.message });
  }
};

// READ - single color
export const getColor = async (req, res) => {
  try {
    const { id } = req.params;
    const color = await Color.findById(id);
    if (!color) return res.status(404).json({ message: "Color not found" });
    res.status(200).json({ message: "Success", data: color });
  } catch (error) {
    res.status(500).json({ message: "Error fetching color", error: error.message });
  }
};

// UPDATE
export const updateColor = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, hex_code } = req.body;

    const color = await Color.findByIdAndUpdate(
      id,
      { name, hex_code },
      { new: true, runValidators: true }
    );

    if (!color) return res.status(404).json({ message: "Color not found" });

    res.status(200).json({ message: "Color updated successfully", data: color });
  } catch (error) {
    res.status(500).json({ message: "Error updating color", error: error.message });
  }
};

// DELETE
export const deleteColor = async (req, res) => {
  try {
    const { id } = req.params;
    const color = await Color.findByIdAndDelete(id);

    if (!color) return res.status(404).json({ message: "Color not found" });

    res.status(200).json({ message: "Color deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting color", error: error.message });
  }
};

export default {
  createColor,
  getAllColors,
  getColor,
  updateColor,
  deleteColor,
};
