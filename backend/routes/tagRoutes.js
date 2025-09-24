const express = require("express");
const tagController = require("../controllers/tagController");

const router = express.Router();

router
  .route("/")
  .get(tagController.getAllTags)   // GET /api/tags
  .post(tagController.createTag);  // POST /api/tags

router
  .route("/:id")
  .get(tagController.getTag)       // GET /api/tags/:id
  .patch(tagController.updateTag)  // PATCH /api/tags/:id
  .delete(tagController.deleteTag);// DELETE /api/tags/:id

module.exports = router;
