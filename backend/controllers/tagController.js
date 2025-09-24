const Tag = require("../models/Tag");

// Lấy tất cả tag
exports.getAllTags = async (req, res) => {
  try {
    const tags = await Tag.find();
    res.status(200).json({
      status: "success",
      results: tags.length,
      data: tags,
    });
  } catch (err) {
    res.status(500).json({ status: "fail", message: err.message });
  }
};

// Lấy 1 tag theo id
exports.getTag = async (req, res) => {
  try {
    const tag = await Tag.findById(req.params.id);
    if (!tag) return res.status(404).json({ status: "fail", message: "Không tìm thấy tag" });

    res.status(200).json({ status: "success", data: tag });
  } catch (err) {
    res.status(500).json({ status: "fail", message: err.message });
  }
};

// Tạo mới tag
exports.createTag = async (req, res) => {
  try {
    const tag = await Tag.create(req.body);
    res.status(201).json({ status: "success", data: tag });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

// Cập nhật tag
exports.updateTag = async (req, res) => {
  try {
    const tag = await Tag.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!tag) return res.status(404).json({ status: "fail", message: "Không tìm thấy tag" });

    res.status(200).json({ status: "success", data: tag });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

// Xóa tag
exports.deleteTag = async (req, res) => {
  try {
    const tag = await Tag.findByIdAndDelete(req.params.id);
    if (!tag) return res.status(404).json({ status: "fail", message: "Không tìm thấy tag" });

    res.status(204).json({ status: "success", data: null });
  } catch (err) {
    res.status(500).json({ status: "fail", message: err.message });
  }
};
