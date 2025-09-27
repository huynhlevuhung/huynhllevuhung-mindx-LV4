import OrderItem from "../models/OrderItemModel.js";
import Bill from "../models/BillModel.js";
import ProductVariant from "../models/ProductVariantModel.js";
import Promotion from "../models/PromotionModel.js";

const orderItemController = {
  // CREATE order item
  createOrderItem: async (req, res) => {
    try {
      const { orderId, variantId, quantity, promotionId } = req.body;

      const bill = await Bill.findById(orderId);
      if (!bill) return res.status(404).json({ message: "Bill not found" });

      const variant = await ProductVariant.findById(variantId);
      if (!variant) return res.status(404).json({ message: "Product variant not found" });

      let price = variant.sale_price || variant.base_price;
      let discount = 0;

      if (promotionId) {
        const promo = await Promotion.findById(promotionId);
        if (promo && promo.scope === "product") {
          if (promo.discount_type === "percent") {
            discount = (price * promo.discount_value) / 100;
            price = price - discount;
          } else if (promo.discount_type === "fixed") {
            discount = promo.discount_value;
            price = Math.max(price - discount, 0);
          }
        }
      }

      const orderItem = await OrderItem.create({
        order: orderId,
        variant: variantId,
        price,
        quantity,
        promotion: promotionId || null,
        discount_amount: discount,
      });

      bill.total_amount += price * quantity;
      bill.final_amount += price * quantity;
      await bill.save();

      res.status(201).json({ message: "Order item created", data: orderItem });
    } catch (error) {
      res.status(500).json({ message: "Error creating order item", error: error.message });
    }
  },

  // GET order items by bill
  getOrderItemsByBill: async (req, res) => {
    try {
      const { orderId } = req.params;
      const items = await OrderItem.find({ order: orderId })
        .populate("variant")
        .populate("promotion");

      res.status(200).json({ message: "Success", data: items });
    } catch (error) {
      res.status(500).json({ message: "Error fetching order items", error: error.message });
    }
  },

  // UPDATE order item
  updateOrderItem: async (req, res) => {
    try {
      const { id } = req.params;
      const { quantity, promotionId } = req.body;

      const orderItem = await OrderItem.findById(id);
      if (!orderItem) return res.status(404).json({ message: "Order item not found" });

      const variant = await ProductVariant.findById(orderItem.variant);
      if (!variant) return res.status(404).json({ message: "Product variant not found" });

      let newPrice = variant.sale_price || variant.base_price;
      let discount = 0;

      if (promotionId) {
        const promo = await Promotion.findById(promotionId);
        if (promo && promo.scope === "product") {
          if (promo.discount_type === "percent") {
            discount = (newPrice * promo.discount_value) / 100;
            newPrice = newPrice - discount;
          } else if (promo.discount_type === "fixed") {
            discount = promo.discount_value;
            newPrice = Math.max(newPrice - discount, 0);
          }
        }
      }

      const bill = await Bill.findById(orderItem.order);
      if (bill) {
        bill.total_amount -= orderItem.price * orderItem.quantity;
        bill.final_amount -= orderItem.price * orderItem.quantity;

        orderItem.quantity = quantity || orderItem.quantity;
        orderItem.price = newPrice;
        orderItem.promotion = promotionId || null;
        orderItem.discount_amount = discount;

        bill.total_amount += newPrice * orderItem.quantity;
        bill.final_amount += newPrice * orderItem.quantity;

        await bill.save();
      }

      await orderItem.save();

      res.status(200).json({ message: "Order item updated", data: orderItem });
    } catch (error) {
      res.status(500).json({ message: "Error updating order item", error: error.message });
    }
  },

  // DELETE order item
  deleteOrderItem: async (req, res) => {
    try {
      const { id } = req.params;
      const orderItem = await OrderItem.findById(id);
      if (!orderItem) return res.status(404).json({ message: "Order item not found" });

      const bill = await Bill.findById(orderItem.order);
      if (bill) {
        bill.total_amount -= orderItem.price * orderItem.quantity;
        bill.final_amount -= orderItem.price * orderItem.quantity;
        await bill.save();
      }

      await orderItem.deleteOne();

      res.status(200).json({ message: "Order item deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting order item", error: error.message });
    }
  },
};

export default orderItemController;
