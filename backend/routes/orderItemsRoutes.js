import { Router } from "express";
import orderItemController from "../controllers/orderItemController.js";
import { protect, restrictTo } from "../middlewares/authMiddleware.js";

const router = Router();

// create order item
router.post("/", protect, restrictTo("admin", "user"), orderItemController.createOrderItem);

// get order items by bill
router.get("/:orderId", protect, orderItemController.getOrderItemsByBill);

// update order item
router.put("/:id", protect, restrictTo("admin", "user"), orderItemController.updateOrderItem);

// delete order item
router.delete("/:id", protect, restrictTo("admin", "user"), orderItemController.deleteOrderItem);

export default router;
