import Cart from "../models/CartModel.js";
import CartItem from "../models/CartItemModel.js";
import ProductVariant from "../models/ProductVariantModel.js";
import Promotion from "../models/PromotionModel.js";

// Add item vào cart
export const addItem = async (req, res) => {
  try {
    const { variantId, quantity, promotionId } = req.body;
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({ user: req.user._id });
    }

    const variant = await ProductVariant.findById(variantId);
    if (!variant) return res.status(404).json({ message: "Variant not found" });

    let price = variant.sale_price || variant.base_price;

    if (promotionId) {
      const promo = await Promotion.findById(promotionId);
      if (promo && promo.scope === "product") {
        if (promo.discount_type === "percent") {
          price = price * (1 - promo.discount_value / 100);
        } else if (promo.discount_type === "fixed") {
          price = Math.max(price - promo.discount_value, 0);
        }
      }
    }

    // check nếu đã có item trong cart
    let item = await CartItem.findOne({ cart: cart._id, variant: variantId });
    if (item) {
      item.quantity += quantity;
      item.price = price;
      await item.save();
    } else {
      item = await CartItem.create({
        cart: cart._id,
        variant: variantId,
        quantity,
        price,
        promotion: promotionId || null,
      });
    }

    res.status(201).json({ message: "Item added", data: item });
  } catch (error) {
    res.status(500).json({ message: "Error adding item", error: error.message });
  }
};

// Get all items in user's cart
export const getItems = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const items = await CartItem.find({ cart: cart._id }).populate("variant promotion");
    res.status(200).json({ message: "Success", data: items });
  } catch (error) {
    res.status(500).json({ message: "Error fetching items", error: error.message });
  }
};

// Update item quantity
export const updateItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const item = await CartItem.findByIdAndUpdate(
      req.params.id,
      { quantity },
      { new: true, runValidators: true }
    );
    if (!item) return res.status(404).json({ message: "Item not found" });

    res.status(200).json({ message: "Item updated", data: item });
  } catch (error) {
    res.status(500).json({ message: "Error updating item", error: error.message });
  }
};

// Remove item
export const deleteItem = async (req, res) => {
  try {
    const item = await CartItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    res.status(200).json({ message: "Item deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting item", error: error.message });
  }
};
