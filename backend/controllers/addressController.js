import AddressModel from "../models/AddressModel.js";

const addressController = {
  // CREATE
  create: async (req, res) => {
    try {
      if (!req.user?._id) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { street, city, district, phone_number, is_default } = req.body;
      if (!street || !city || !district || !phone_number) {
        return res.status(400).json({ message: "All fields are required" });
      }

      // Nếu set là default -> unset default của các address khác
      if (is_default) {
        await AddressModel.updateMany(
          { user: req.user._id },
          { is_default: false }
        );
      }

      const newAddress = new AddressModel({
        street,
        city,
        district,
        phone_number,
        is_default: !!is_default,
        user: req.user._id,
      });

      await newAddress.save();
      res.status(201).json({ message: "Address created", data: newAddress });
    } catch (error) {
      res.status(500).json({ message: "Error creating address", error: error.message });
    }
  },

  // READ ALL (theo user)
  getAll: async (req, res) => {
    try {
      if (!req.user?._id) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const addresses = await AddressModel.find({ user: req.user._id }).sort({ created_at: -1 });
      res.status(200).json({ message: "Success", data: addresses });
    } catch (error) {
      res.status(500).json({ message: "Error fetching addresses", error: error.message });
    }
  },

  // READ ONE
  getOne: async (req, res) => {
    try {
      const address = await AddressModel.findOne({
        _id: req.params.id,
        user: req.user._id,
      });

      if (!address) {
        return res.status(404).json({ message: "Address not found" });
      }
      res.status(200).json({ message: "Success", data: address });
    } catch (error) {
      res.status(500).json({ message: "Error fetching address", error: error.message });
    }
  },

  // UPDATE
  update: async (req, res) => {
    try {
      const { is_default } = req.body;

      if (is_default) {
        // Nếu update sang default -> unset các default khác
        await AddressModel.updateMany(
          { user: req.user._id },
          { is_default: false }
        );
      }

      const updated = await AddressModel.findOneAndUpdate(
        { _id: req.params.id, user: req.user._id },
        req.body,
        { new: true, runValidators: true }
      );

      if (!updated) {
        return res.status(404).json({ message: "Address not found" });
      }
      res.status(200).json({ message: "Address updated successfully", data: updated });
    } catch (error) {
      res.status(500).json({ message: "Error updating address", error: error.message });
    }
  },

  // DELETE
  delete: async (req, res) => {
    try {
      const deleted = await AddressModel.findOneAndDelete({
        _id: req.params.id,
        user: req.user._id,
      });

      if (!deleted) {
        return res.status(404).json({ message: "Address not found" });
      }
      res.status(200).json({ message: "Address deleted successfully", data: null });
    } catch (error) {
      res.status(500).json({ message: "Error deleting address", error: error.message });
    }
  },

  // SET DEFAULT
  setDefault: async (req, res) => {
    try {
      if (!req.user?._id) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // unset default
      await AddressModel.updateMany(
        { user: req.user._id },
        { is_default: false }
      );

      // set new default
      const updated = await AddressModel.findOneAndUpdate(
        { _id: req.params.id, user: req.user._id },
        { is_default: true },
        { new: true }
      );

      if (!updated) {
        return res.status(404).json({ message: "Address not found" });
      }

      res.status(200).json({ message: "Default address updated", data: updated });
    } catch (error) {
      res.status(500).json({ message: "Error setting default address", error: error.message });
    }
  },
};

export default addressController;
