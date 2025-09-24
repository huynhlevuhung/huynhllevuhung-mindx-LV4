import ProductModel from "../models/ProductModel.js";
import "../models/StoreModel.js";
import "../models/TagModel.js";
import TagModel from "../models/TagModel.js";
import "../models/AreaModel.js";

const productController = {
  // CREATE
  createProduct: async (req, res) => {
  try {
    const { productName, price, quantity, description, img, store } = req.body;

    const newProduct = new ProductModel({
      productName,
      price,
      quantity,
      description,
      img,
      store: store && store.trim() !== "" ? store : null, // 👈 nếu không có thì để null
    });

    await newProduct.save();

    res.status(201).send({
      message: "Product created successfully",
      data: newProduct,
    });
  } catch (error) {
    res.status(500).send({ message: "Error", error: error.message });
  }
},


  // READ
  getAllProducts: async (req, res) => {
    try {
      const curPage = parseInt(req.query.curPage) || 1;
      const itemQuantity = await ProductModel.countDocuments();
      const numberOfPages = Math.ceil(itemQuantity / 20);

      if (curPage > numberOfPages && numberOfPages > 0) {
        return res.status(400).send({ message: "Invalid page number" });
      }

      const data = await ProductModel.find()
        .populate({ path: "store", populate: { path: "area", model: "Area" } })
        .populate("tags")
        .limit(20)
        .skip((curPage - 1) * 20);

      res.status(200).send({
        message: "Success",
        data,
        numberOfPages,
      });
    } catch (error) {
      res.status(500).send({
        message: "Error",
        error: error.message,
      });
    }
  },

  getOneProduct: async (req, res) => {
    try {
      const { id } = req.params;
      const data = await ProductModel.findById(id)
        .populate("store")
        .populate("tags");
      if (!data) {
        return res.status(404).send({ message: "Product not found" });
      }
      res.status(200).send({ message: "Success", data });
    } catch (error) {
      res.status(500).send({ message: "Error", error: error.message });
    }
  },

  getMostFavouriteProducts: async (req, res) => {
    try {
      const data = await ProductModel.find()
        .sort({ traded_count: -1 })
        .limit(20)
        .populate("store")
        .populate("tags");

      res.status(200).send({ message: "Success", data });
    } catch (error) {
      res.status(500).send({ message: "Error", error: error.message });
    }
  },

  getTopRatingProducts: async (req, res) => {
    try {
      const products = await ProductModel.find()
        .populate("store")
        .populate("tags");

      const data = products
        .sort((a, b) => b.curRating - a.curRating)
        .slice(0, 20);

      res.status(200).send({ message: "Success", data });
    } catch (error) {
      res.status(500).send({ message: "Error", error: error.message });
    }
  },

  getProductsByTag: async (req, res) => {
    try {
      const { tagId } = req.params;
      const curPage = parseInt(req.query.curPage) || 1;
      const itemQuantity = await ProductModel.countDocuments({ tags: tagId });
      const numberOfPages = Math.ceil(itemQuantity / 20);

      if (curPage > numberOfPages && numberOfPages > 0) {
        return res.status(400).send({ message: "Invalid page number" });
      }

      const tag = await TagModel.findById(tagId);

      const data = await ProductModel.find({ tags: tag })
        .populate("store")
        .populate("tags")
        .limit(20)
        .skip((curPage - 1) * 20);

      res.status(200).send({
        message: "Success",
        data,
        numberOfPages,
      });
    } catch (error) {
      res.status(500).send({
        message: "Error",
        error: error.message,
      });
    }
  },

  getProductsByPriceRange: async (req, res) => {
    try {
      const { min, max } = req.query;
      const curPage = parseInt(req.query.curPage) || 1;
      const itemQuantity = await ProductModel.countDocuments({
        price: { $gte: min || 0, $lte: max || Number.MAX_SAFE_INTEGER },
      });
      const numberOfPages = Math.ceil(itemQuantity / 20);
      const data = await ProductModel.find({
        price: { $gte: min || 0, $lte: max || Number.MAX_SAFE_INTEGER },
      })
        .populate("store")
        .populate("tags")
        .limit(20)
        .skip((curPage - 1) * 20);

      res.status(200).send({
        message: "Success",
        data,
        numberOfPages,
      });
    } catch (error) {
      res.status(500).send({
        message: "Error",
        error: error.message,
      });
    }
  },

  getProductsByStore: async (req, res) => {
    try {
      const { storeId } = req.params;
      const curPage = parseInt(req.query.curPage) || 1;
      const itemQuantity = await ProductModel.countDocuments({ store: storeId });
      const numberOfPages = Math.ceil(itemQuantity / 20);
      const data = await ProductModel.find({ store: storeId })
        .populate("store")
        .populate("tags")
        .limit(20)
        .skip((curPage - 1) * 20);
      res.status(200).send({
        message: "Success",
        data,
        numberOfPages,
      });
    } catch (error) {
      res.status(500).send({
        message: "Error",
        error: error.message,
      });
    }
  },

  // UPDATE
  updateProduct: async (req, res) => {
    try {
      const { id } = req.params;
      const product = await ProductModel.findByIdAndUpdate(id, req.body, { new: true });
      if (!product) {
        return res.status(404).send({ message: "Product not found" });
      }
      res.status(200).send({
        message: "Product updated successfully",
        data: product,
      });
    } catch (error) {
      res.status(500).send({ message: "Error", error: error.message });
    }
  },

  // DELETE
  deleteProduct: async (req, res) => {
    try {
      const { id } = req.params;
      const product = await ProductModel.findByIdAndDelete(id);
      if (!product) {
        return res.status(404).send({ message: "Product not found" });
      }
      res.status(200).send({
        message: "Product deleted successfully",
      });
    } catch (error) {
      res.status(500).send({ message: "Error", error: error.message });
    }
  },
};

export default productController;
