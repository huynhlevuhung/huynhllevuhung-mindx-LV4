import Bill from "../models/BillModel.js";
import Promotion from "../models/PromotionModel.js";

const billController = {
  // CREATE bill
  createBill: async (req, res) => {
    try {
      const { user, store, address, promotionId, notes } = req.body;

      const bill = await Bill.create({
        user,
        store,
        address,
        promotion: promotionId || null,
        notes: notes || "",
      });

      res.status(201).json({ message: "Bill created successfully", data: bill });
    } catch (error) {
      res.status(500).json({ message: "Error creating bill", error: error.message });
    }
  },

  // GET all bills
  getAllBills: async (req, res) => {
    try {
      const bills = await Bill.find()
        .populate("user")
        .populate("store")
        .populate("promotion")
        .populate("address");

      res.status(200).json({ message: "Success", data: bills });
    } catch (error) {
      res.status(500).json({ message: "Error fetching bills", error: error.message });
    }
  },

  // GET bill by id
  getBillById: async (req, res) => {
    try {
      const { id } = req.params;
      const bill = await Bill.findById(id)
        .populate("user")
        .populate("store")
        .populate("promotion")
        .populate("address");

      if (!bill) return res.status(404).json({ message: "Bill not found" });

      res.status(200).json({ message: "Success", data: bill });
    } catch (error) {
      res.status(500).json({ message: "Error fetching bill", error: error.message });
    }
  },

  // UPDATE bill
  // UPDATE bill status only
updateBillStatus: async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const bill = await Bill.findById(id);
    if (!bill) return res.status(404).json({ message: "Bill not found" });

    bill.status = status;
    await bill.save();

    res.status(200).json({ message: "Bill status updated", data: bill });
  } catch (error) {
    res.status(500).json({ message: "Error updating bill status", error: error.message });
  }
},


  // DELETE bill
  deleteBill: async (req, res) => {
    try {
      const { id } = req.params;

      const bill = await Bill.findById(id);
      if (!bill) return res.status(404).json({ message: "Bill not found" });

      await bill.deleteOne();

      res.status(200).json({ message: "Bill deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting bill", error: error.message });
    }
  },
};



export default billController;
