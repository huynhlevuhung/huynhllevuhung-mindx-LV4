import { Router } from "express";
import { addItem, getItems, updateItem, deleteItem } from "../controllers/cartItemController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/", protect, addItem);
router.get("/", protect, getItems);
router.put("/:id", protect, updateItem);
router.delete("/:id", protect, deleteItem);

export default router;
