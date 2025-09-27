import ProductModel from "../models/ProductModel.js";
import ImageModel from "../models/ImageModel.js";

import "../models/StoreModel.js";
import "../models/AreaModel.js";
import cloudinary from "../utils/cloudinary.js";

const productController = {
  // ---------------- CREATE ----------------
  createProduct: async (req, res) => {
    try {
      const { name, base_price, sale_price, description, store, tags } = req.body;

      const newProduct = new ProductModel({
        name,
        base_price,
        sale_price: sale_price || null,
        description,
        store: store?.trim() !== "" ? store : null,
        tags: tags || [],
      });

      await newProduct.save();

      // Upload ảnh nếu có
      if (req.files && req.files.length > 0) {
        const imageDocs = [];
        for (const file of req.files) {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: "products",
          });

          const img = new ImageModel({
            url: result.secure_url,
            public_id: result.public_id,
            product: newProduct._id,
          });
          await img.save();
          imageDocs.push(img._id);
        }

        newProduct.img = imageDocs;
        await newProduct.save();
      }

      res.status(201).send({
        message: "Product created successfully",
        data: await newProduct.populate(["store", "tags", "img"]),
      });
    } catch (error) {
      res.status(500).send({ message: "Error", error: error.message });
    }
  },

  // ---------------- READ ALL (phân trang) ----------------
  getAllProducts: async (req, res) => {
    try {
      const curPage = parseInt(req.query.curPage) || 1;
      const tagId = req.query.tagId;
      const name = req.query.name || "";
      const query = {};

      if (tagId) query.tags = { $in: [tagId] };
      if (name) query.name = { $regex: name, $options: "i" };

      const itemQuantity = await ProductModel.countDocuments(query);
      const numberOfPages = Math.ceil(itemQuantity / 20);

      if (curPage > numberOfPages && numberOfPages > 0) {
        return res.status(400).send({ message: "Invalid page number" });
      }

      const data = await ProductModel.find(query)
        .populate({ path: "store", populate: { path: "area", model: "Area" } })
        .populate("tags")
        .populate("img")
        .limit(20)
        .skip((curPage - 1) * 20);

      res.status(200).send({ message: "Success", data, numberOfPages });
    } catch (error) {
      res.status(500).send({ message: "Error", error: error.message });
    }
  },

  // ---------------- READ ONE ----------------
  getOneProduct: async (req, res) => {
    try {
      const { id } = req.params;
      const data = await ProductModel.findById(id)
        .populate({ path: "store", populate: { path: "area", model: "Area" } })
        .populate("tags")
        .populate("img");

      if (!data) return res.status(404).send({ message: "Product not found" });
      res.status(200).send({ message: "Success", data });
    } catch (error) {
      res.status(500).send({ message: "Error", error: error.message });
    }
  },

  // ---------------- UPDATE ----------------
  updateProduct: async (req, res) => {
    try {
      const { id } = req.params;
      const product = await ProductModel.findById(id).populate("img");

      if (!product) return res.status(404).send({ message: "Product not found" });

      Object.assign(product, req.body);

      if (req.files && req.files.length > 0) {
        // Xóa ảnh cũ
        for (const img of product.img) {
          await cloudinary.uploader.destroy(img.public_id);
          await ImageModel.findByIdAndDelete(img._id);
        }

        // Thêm ảnh mới
        const imageDocs = [];
        for (const file of req.files) {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: "products",
          });

          const img = new ImageModel({
            url: result.secure_url,
            public_id: result.public_id,
            product: product._id,
          });
          await img.save();
          imageDocs.push(img._id);
        }
        product.img = imageDocs;
      }

      await product.save();
      res.status(200).send({
        message: "Product updated successfully",
        data: await product.populate(["store", "tags", "img"]),
      });
    } catch (error) {
      res.status(500).send({ message: "Error", error: error.message });
    }
  },

  // ---------------- DELETE ----------------
  deleteProduct: async (req, res) => {
    try {
      const { id } = req.params;
      const product = await ProductModel.findById(id).populate("img");

      if (!product) return res.status(404).send({ message: "Product not found" });

      for (const img of product.img) {
        await cloudinary.uploader.destroy(img.public_id);
        await ImageModel.findByIdAndDelete(img._id);
      }

      await ProductModel.findByIdAndDelete(id);
      res.status(200).send({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(500).send({ message: "Error", error: error.message });
    }
  },

  // ---------------- MOST FAVOURITE ----------------
  getMostFavouriteProducts: async (req, res) => {
    try {
      const data = await ProductModel.find()
        .sort({ traded_count: -1 })
        .limit(20)
        .populate({ path: "store", populate: { path: "area", model: "Area" } })
        .populate("tags")
        .populate("img");

      res.status(200).send({ message: "Success", data });
    } catch (error) {
      res.status(500).send({ message: "Error", error: error.message });
    }
  },

  // ---------------- TOP RATING ----------------
  getTopRatingProducts: async (req, res) => {
    try {
      const products = await ProductModel.find()
        .populate({ path: "store", populate: { path: "area", model: "Area" } })
        .populate("tags")
        .populate("img");

      const data = products
        .sort((a, b) => b.curRating - a.curRating)
        .slice(0, 20);

      res.status(200).send({ message: "Success", data });
    } catch (error) {
      res.status(500).send({ message: "Error", error: error.message });
    }
  },

  // ---------------- BY TAG ----------------
  getProductsByTag: async (req, res) => {
    try {
      const { tagId } = req.params;
      const curPage = parseInt(req.query.curPage) || 1;
      const itemQuantity = await ProductModel.countDocuments({ tags: tagId });
      const numberOfPages = Math.ceil(itemQuantity / 20);

      if (curPage > numberOfPages && numberOfPages > 0) {
        return res.status(400).send({ message: "Invalid page number" });
      }

      const data = await ProductModel.find({ tags: tagId })
        .populate({ path: "store", populate: { path: "area", model: "Area" } })
        .populate("tags")
        .populate("img")
        .limit(20)
        .skip((curPage - 1) * 20);

      res.status(200).send({ message: "Success", data, numberOfPages });
    } catch (error) {
      res.status(500).send({ message: "Error", error: error.message });
    }
  },

  // ---------------- BY STORE ----------------
  getProductsByStore: async (req, res) => {
    try {
      const { storeId } = req.params;
      const curPage = parseInt(req.query.curPage) || 1;
      const itemQuantity = await ProductModel.countDocuments({ store: storeId });
      const numberOfPages = Math.ceil(itemQuantity / 20);

      const data = await ProductModel.find({ store: storeId })
        .populate({ path: "store", populate: { path: "area", model: "Area" } })
        .populate("tags")
        .populate("img")
        .limit(20)
        .skip((curPage - 1) * 20);

      res.status(200).send({ message: "Success", data, numberOfPages });
    } catch (error) {
      res.status(500).send({ message: "Error", error: error.message });
    }
  },

  // ---------------- BY PRICE RANGE ----------------
  getProductsByPriceRange: async (req, res) => {
    try {
      const { min, max } = req.query;
      const curPage = parseInt(req.query.curPage) || 1;

      const query = { base_price: { $gte: min || 0, $lte: max || Number.MAX_SAFE_INTEGER } };
      const itemQuantity = await ProductModel.countDocuments(query);
      const numberOfPages = Math.ceil(itemQuantity / 20);

      const data = await ProductModel.find(query)
        .populate({ path: "store", populate: { path: "area", model: "Area" } })
        .populate("tags")
        .populate("img")
        .limit(20)
        .skip((curPage - 1) * 20);

      res.status(200).send({ message: "Success", data, numberOfPages });
    } catch (error) {
      res.status(500).send({ message: "Error", error: error.message });
    }
  },

  // ---------------- SEARCH BY NAME ----------------
  searchByName: async (req, res) => {
    try {
      const { keyword } = req.query;
      if (!keyword) return res.status(400).send({ message: "Keyword required" });

      const totalResults = await ProductModel.countDocuments({
        name: { $regex: keyword, $options: "i" },
      });

      const data = await ProductModel.find({
        name: { $regex: keyword, $options: "i" },
      })
        .limit(5)
        .select("name img");

      res.status(200).send({ message: "Success", data, totalResults });
    } catch (error) {
      res.status(500).send({ message: "Error", error: error.message });
    }
  },
};

export default productController;
