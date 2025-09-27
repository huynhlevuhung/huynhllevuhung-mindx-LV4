import express from "express";
import addressController from "../controllers/addressController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// CREATE
router.post("/", protect, addressController.create);

// READ ALL (theo user)
router.get("/", protect, addressController.getAll);

// READ ONE
router.get("/:id", protect, addressController.getOne);

// UPDATE
router.put("/:id", protect, addressController.update);

// DELETE
router.delete("/:id", protect, addressController.delete);

// SET DEFAULT
router.patch("/:id/default", protect, addressController.setDefault);

export default router;
