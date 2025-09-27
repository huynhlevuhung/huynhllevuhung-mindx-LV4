// routes/colorsRoutes.js
import express from "express";
import colorController from "../controllers/colorController.js";

const router = express.Router();

router.post("/", colorController.createColor);
router.get("/", colorController.getAllColors);
router.get("/:id", colorController.getColor);
router.patch("/:id", colorController.updateColor);
router.delete("/:id", colorController.deleteColor);

export default router;
