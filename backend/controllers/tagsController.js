import TagModel from "../models/TagModel.js";

const tagsController = {
  // 📌 CREATE
  create: async (req, res) => {
    try {
      const { name } = req.body;

      // check trùng tên
      const exist = await TagModel.findOne({ name });
      if (exist) {
        return res.status(400).send({ message: "Tag already exists" });
      }

      const newTag = new TagModel({ name });
      await newTag.save();

      res.status(201).send({ message: "Tag created successfully", data: newTag });
    } catch (error) {
      res.status(500).send({ message: "Error", error: error.message });
    }
  },

  // 📌 READ ALL
  getAll: async (req, res) => {
    try {
      const tags = await TagModel.find();
      res.status(200).send({ message: "Success", data: tags });
    } catch (error) {
      res.status(500).send({ message: "Error", error: error.message });
    }
  },

  // 📌 READ LIMIT 5
  getFive: async (req, res) => {
    try {
      const countTags = await TagModel.countDocuments();
      const tags = await TagModel.find().limit(5);

      res.status(200).send({ message: "Success", data: tags, open: countTags > 5 });
    } catch (error) {
      res.status(500).send({ message: "Error", error: error.message });
    }
  },

  // 📌 READ ONE
  getOne: async (req, res) => {
    try {
      const { id } = req.params;
      const tag = await TagModel.findById(id);
      if (!tag) {
        return res.status(404).send({ message: "Tag not found" });
      }
      res.status(200).send({ message: "Success", data: tag });
    } catch (error) {
      res.status(500).send({ message: "Error", error: error.message });
    }
  },

  // 📌 UPDATE
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { name } = req.body;

      const updatedTag = await TagModel.findByIdAndUpdate(
        id,
        { name },
        { new: true, runValidators: true }
      );

      if (!updatedTag) {
        return res.status(404).send({ message: "Tag not found" });
      }

      res.status(200).send({ message: "Tag updated successfully", data: updatedTag });
    } catch (error) {
      res.status(500).send({ message: "Error", error: error.message });
    }
  },

  // 📌 DELETE
  deleteTag: async (req, res) => {
    try {
      const { id } = req.params;
      const deletedTag = await TagModel.findByIdAndDelete(id);

      if (!deletedTag) {
        return res.status(404).send({ message: "Tag not found" });
      }

      res.status(200).send({ message: "Tag deleted successfully" });
    } catch (error) {
      res.status(500).send({ message: "Error", error: error.message });
    }
  },
};

export default tagsController;
