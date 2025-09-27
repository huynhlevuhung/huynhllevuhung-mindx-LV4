import Promotion from "../models/PromotionModel.js";
import Store from "../models/StoreModel.js";
import Product from "../models/ProductModel.js";

// 📌 Tạo promotion
export const createPromotion = async (req, res) => {
  try {
    const {
      storeId,
      name,
      discount_type,
      discount_value,
      start_date,
      end_date,
      scope,
    } = req.body;

    const userId = req.user._id;

    // Kiểm tra store tồn tại
    const store = await Store.findById(storeId);
    if (!store) return res.status(404).json({ message: "Store not found" });

    // Chỉ owner của store hoặc admin mới được tạo promotion
    if (String(store.owner) !== String(userId) && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền tạo promotion cho store này" });
    }

    const promotion = await Promotion.create({
      store: storeId,
      name,
      scope,
      discount_type,
      discount_value,
      start_date,
      end_date,
    });

    res.status(201).json({
      message: "Promotion created successfully",
      data: promotion,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating promotion" });
  }
};

// 📌 Lấy tất cả promotions
export const getPromotions = async (req, res) => {
  try {
    let filter = {};

    // Seller chỉ xem promotion của store mình
    if (req.user.role === "seller") {
      const storeIds = await Store.find({ owner: req.user._id }).distinct("_id");
      filter.store = { $in: storeIds };
    }

    const promotions = await Promotion.find(filter).populate("store", "storeName");

    res.json({ message: "Success", data: promotions });
  } catch (error) {
    res.status(500).json({ message: "Error fetching promotions" });
  }
};

// 📌 Lấy chi tiết promotion
export const getPromotionById = async (req, res) => {
  try {
    const promotion = await Promotion.findById(req.params.id).populate(
      "store",
      "storeName"
    );

    if (!promotion)
      return res.status(404).json({ message: "Promotion not found" });

    res.json({ message: "Success", data: promotion });
  } catch (error) {
    res.status(500).json({ message: "Error fetching promotion" });
  }
};

// 📌 Cập nhật promotion
export const updatePromotion = async (req, res) => {
  try {
    const promotion = await Promotion.findById(req.params.id);
    if (!promotion)
      return res.status(404).json({ message: "Promotion not found" });

    const store = await Store.findById(promotion.store);

    // Chỉ owner hoặc admin mới có quyền
    if (
      String(store.owner) !== String(req.user._id) &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền sửa promotion này" });
    }

    Object.assign(promotion, req.body);
    await promotion.save();

    res.json({ message: "Promotion updated successfully", data: promotion });
  } catch (error) {
    res.status(500).json({ message: "Error updating promotion" });
  }
};

// 📌 Xóa promotion
export const deletePromotion = async (req, res) => {
  try {
    const promotion = await Promotion.findById(req.params.id);
    if (!promotion)
      return res.status(404).json({ message: "Promotion not found" });

    const store = await Store.findById(promotion.store);

    if (
      String(store.owner) !== String(req.user._id) &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền xóa promotion này" });
    }

    await promotion.deleteOne();
    res.json({ message: "Promotion deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting promotion" });
  }
};
