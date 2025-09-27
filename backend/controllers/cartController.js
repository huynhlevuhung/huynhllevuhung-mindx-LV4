import Cart from "../models/CartModel.js";

export const createCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (cart) return res.status(200).json({ message: "Cart already exists", data: cart });

    cart = await Cart.create({ user: req.user._id });
    res.status(201).json({ message: "Cart created", data: cart });
  } catch (error) {
    res.status(500).json({ message: "Error creating cart", error: error.message });
  }
};

export const getCartByUser = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    res.status(200).json({ message: "Success", data: cart });
  } catch (error) {
    res.status(500).json({ message: "Error fetching cart", error: error.message });
  }
};

export const deleteCart = async (req, res) => {
  try {
    const deleted = await Cart.findOneAndDelete({ user: req.user._id });
    if (!deleted) return res.status(404).json({ message: "Cart not found" });

    res.status(200).json({ message: "Cart deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting cart", error: error.message });
  }
};
