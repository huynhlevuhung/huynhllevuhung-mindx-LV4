import { Router } from "express";
import { createCart, getCartByUser, deleteCart } from "../controllers/cartController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/", protect, createCart);
router.get("/", protect, getCartByUser);
router.delete("/", protect, deleteCart);

export default router;
