const express = require("express");
const Customer = require("../models/Customer");
const protect = require("../middleware/authMiddleware");

const router = express.Router();


// ==========================================
// CREATE CUSTOMER
// POST /api/customers
// ==========================================
router.post("/", protect, async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      company,
      address,
      status,
      notes,
      assignedTo
    } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Customer name is required"
      });
    }

    const customer = await Customer.create({
      name,
      email,
      phone,
      company,
      address,
      status,
      notes,
      assignedTo
    });

    res.status(201).json({
      message: "Customer created successfully",
      customer
    });

  } catch (error) {
    console.error("Create customer error:", error.message);

    res.status(500).json({
      message: "Server error while creating customer"
    });
  }
});


// ==========================================
// GET ALL CUSTOMERS
// GET /api/customers
// ==========================================
router.get("/", protect, async (req, res) => {
  try {
    const customers = await Customer.find()
      .populate("assignedTo", "name email role")
      .sort({ createdAt: -1 });

    res.json({
      count: customers.length,
      customers
    });

  } catch (error) {
    console.error("Get customers error:", error.message);

    res.status(500).json({
      message: "Server error while fetching customers"
    });
  }
});


// ==========================================
// UPDATE CUSTOMER
// PUT /api/customers/:id
// ==========================================

router.put("/:id", protect, async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate("assignedTo", "name email role");

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found"
      });
    }

    res.json({
      message: "Customer updated successfully",
      customer
    });

  } catch (error) {
    console.error("UPDATE CUSTOMER ERROR:", error);

    res.status(500).json({
      message: "Server error while updating customer",
      error: error.message
    });
  }
});
// ==========================================
// DELETE CUSTOMER
// DELETE /api/customers/:id
// ==========================================
router.delete("/:id", protect, async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found"
      });
    }

    res.json({
      message: "Customer deleted successfully"
    });

  } catch (error) {
    console.error("Delete customer error:", error.message);
  }
});


// ==========================================
// SEARCH CUSTOMERS
// GET /api/customers/search?q=keyword
// ==========================================
router.get("/search", protect, async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        message: "Search keyword is required"
      });
    }

    const customers = await Customer.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
        { phone: { $regex: q, $options: "i" } },
        { company: { $regex: q, $options: "i" } }
      ]
    })
      .populate("assignedTo", "name email role")
      .sort({ createdAt: -1 });

    res.json({
      count: customers.length,
      customers
    });

  } catch (error) {
    console.error("Search customer error:", error.message);

    res.status(500).json({
      message: "Server error while searching customers"
    });
  }
});


// ==========================================
// GET SINGLE CUSTOMER
// GET /api/customers/:id
// ==========================================
router.get("/:id", protect, async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id)
      .populate("assignedTo", "name email role");

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found"
      });
    }

    res.json({
      customer
    });

  } catch (error) {
  console.error("UPDATE CUSTOMER ERROR:", error);

  return res.status(500).json({
    message: "Server error while updating customer",
    error: error.message
  });
}
});


module.exports = router;