import StoreModel from "../models/StoreModel.js";
import ProductModel from "../models/ProductModel.js";

const storeController = {
  // 📌 Lấy thông tin 1 store + sản phẩm trong store
  getStoreInfo: async (req, res) => {
    try {
      const { id } = req.params;
      const page = parseInt(req.query.page) || 1;

      const productCount = await ProductModel.countDocuments({ store: id });
      const numberOfPages = Math.ceil(productCount / 10);

      const products = await ProductModel.find({ store: id })
        .limit(10)
        .skip((page - 1) * 10);

      const store = await StoreModel.findById(id)
        .populate("owner", "-password -__v -createdAt -updatedAt")
        .populate("area");

      if (!store) {
        return res.status(404).send({ message: "Store not found" });
      }

      res
        .status(200)
        .send({ message: "Success", data: store, products, numberOfPages });
    } catch (error) {
      res.status(500).send({ message: "Error", error: error.message });
    }
  },

  // 📌 Lấy tất cả store
  getAllStores: async (req, res) => {
    try {
      const stores = await StoreModel.find()
        .populate("owner", "-password -__v -createdAt -updatedAt")
        .populate("area");

      res.status(200).send({ message: "Success", data: stores });
    } catch (error) {
      res.status(500).send({ message: "Error", error: error.message });
    }
  },

  // 📌 Tạo store mới
 
createStore: async (req, res) => {
  try {
    const { owner, address, name, area, status } = req.body;

    const newStore = new StoreModel({
      owner,
      address,
      name,   // ✅ dùng name thay vì storeName
      area,
      status, // optional, vì schema có default "pending"
    });

    await newStore.save();

    res
      .status(201)
      .send({ message: "Store created successfully", data: newStore });
  } catch (error) {
    res.status(500).send({ message: "Error", error: error.message });
  }
},

  // 📌 Cập nhật store
  updateStore: async (req, res) => {
    try {
      const { id } = req.params;
      const updatedStore = await StoreModel.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!updatedStore) {
        return res.status(404).send({ message: "Store not found" });
      }

      res
        .status(200)
        .send({ message: "Store updated successfully", data: updatedStore });
    } catch (error) {
      res.status(500).send({ message: "Error", error: error.message });
    }
  },

  // 📌 Xóa store
  deleteStore: async (req, res) => {
    try {
      const { id } = req.params;
      const store = await StoreModel.findByIdAndDelete(id);

      if (!store) {
        return res.status(404).send({ message: "Store not found" });
      }

      res.status(200).send({ message: "Store deleted successfully" });
    } catch (error) {
      res.status(500).send({ message: "Error", error: error.message });
    }
  },
};

export default storeController;
