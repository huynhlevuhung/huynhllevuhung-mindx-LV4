import express from "express";
import tagsController from "../controllers/tagsController.js";

const router = express.Router();

// 📌 CREATE
router.post("/", tagsController.create);

// 📌 READ ALL
router.get("/", tagsController.getAll);

// 📌 READ LIMIT 5
router.get("/five", tagsController.getFive);

// 📌 READ ONE
router.get("/:id", tagsController.getOne);

// 📌 UPDATE
router.put("/:id", tagsController.update);

// 📌 DELETE
router.delete("/:id", tagsController.deleteTag); // <--- sửa tên hàm

export default router;
