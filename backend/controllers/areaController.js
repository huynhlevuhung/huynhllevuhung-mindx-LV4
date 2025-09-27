import Area from "../models/AreaModel.js";

// Lấy tất cả khu vực
export const getAllAreas = async (req, res) => {
  try {
    const areas = await Area.find();
    res.status(200).json({ message: "Success", data: areas });
  } catch (error) {
    res.status(500).json({ message: "Error fetching areas", error: error.message });
  }
};

// Lấy 1 khu vực theo id
export const getArea = async (req, res) => {
  try {
    const { id } = req.params;
    const area = await Area.findById(id);
    if (!area) return res.status(404).json({ message: "Area not found" });
    res.status(200).json({ message: "Success", data: area });
  } catch (error) {
    res.status(500).json({ message: "Error fetching area", error: error.message });
  }
};

// Tạo khu vực mới
export const createArea = async (req, res) => {
  try {
    const { name } = req.body;
    const newArea = await Area.create({ name });
    res.status(201).json({ message: "Area created successfully", data: newArea });
  } catch (error) {
    res.status(500).json({ message: "Error creating area", error: error.message });
  }
};

// Cập nhật khu vực
export const updateArea = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Area.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: "Area not found" });
    res.status(200).json({ message: "Area updated successfully", data: updated });
  } catch (error) {
    res.status(500).json({ message: "Error updating area", error: error.message });
  }
};

// Xóa khu vực
export const deleteArea = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Area.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Area not found" });
    res.status(200).json({ message: "Area deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting area", error: error.message });
  }
};

export default {
  getAllAreas,
  getArea,
  createArea,
  updateArea,
  deleteArea,
};
