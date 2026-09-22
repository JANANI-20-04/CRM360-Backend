const express = require("express");
const Lead = require("../models/Lead");
const Customer = require("../models/Customer");
const protect = require("../middleware/authMiddleware");

const router = express.Router();


// ==========================================
// CREATE LEAD
// POST /api/leads
// ==========================================
router.post("/", protect, async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      company,
      value,
      source,
      status,
      notes,
      followUpDate,
      assignedTo
    } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Lead name is required"
      });
    }

    const lead = await Lead.create({
      name,
      email,
      phone,
      company,
      value,
      source,
      status,
      notes,
      followUpDate,
      assignedTo
    });

    res.status(201).json({
      message: "Lead created successfully",
      lead
    });

  } catch (error) {
    console.error("Create lead error:", error.message);

    res.status(500).json({
      message: "Server error while creating lead"
    });
  }
});


// ==========================================
// GET ALL LEADS
// GET /api/leads
// ==========================================
router.get("/", protect, async (req, res) => {
  try {
    const leads = await Lead.find()
      .populate("assignedTo", "name email role")
      .sort({ createdAt: -1 });

    res.json({
      count: leads.length,
      leads
    });

  } catch (error) {
    console.error("Get leads error:", error.message);

    res.status(500).json({
      message: "Server error while fetching leads"
    });
  }
});


// ==========================================
// SEARCH LEADS
// GET /api/leads/search?q=keyword
// ==========================================
router.get("/search", protect, async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        message: "Search keyword is required"
      });
    }

    const leads = await Lead.find({
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
      count: leads.length,
      leads
    });

  } catch (error) {
    console.error("Search lead error:", error.message);

    res.status(500).json({
      message: "Server error while searching leads"
    });
  }
});


// ==========================================
// GET SINGLE LEAD
// GET /api/leads/:id
// ==========================================
router.get("/:id", protect, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id)
      .populate("assignedTo", "name email role");

    if (!lead) {
      return res.status(404).json({
        message: "Lead not found"
      });
    }

    res.json({
      lead
    });

  } catch (error) {
    console.error("Get lead error:", error.message);

    res.status(500).json({
      message: "Server error while fetching lead"
    });
  }
});


// ==========================================
// UPDATE LEAD
// PUT /api/leads/:id
// ==========================================
router.put("/:id", protect, async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate("assignedTo", "name email role");

    if (!lead) {
      return res.status(404).json({
        message: "Lead not found"
      });
    }

    res.json({
      message: "Lead updated successfully",
      lead
    });

  } catch (error) {
    console.error("Update lead error:", error.message);

    res.status(500).json({
      message: "Server error while updating lead"
    });
  }
});


// ==========================================
// DELETE LEAD
// DELETE /api/leads/:id
// ==========================================
router.delete("/:id", protect, async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);

    if (!lead) {
      return res.status(404).json({
        message: "Lead not found"
      });
    }

    res.json({
      message: "Lead deleted successfully"
    });

  } catch (error) {
    console.error("Delete lead error:", error.message);

    res.status(500).json({
      message: "Server error while deleting lead"
    });
  }
});
// CONVERT LEAD TO CUSTOMER
router.post("/:id/convert", protect, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        message: "Lead not found"
      });
    }

    // Prevent converting the same lead twice
    if (lead.status === "Won") {
      return res.status(400).json({
        message: "This lead has already been converted"
      });
    }

    const customer = await Customer.create({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      company: lead.company,
      notes: lead.notes,
      assignedTo: lead.assignedTo
    });

    lead.status = "Won";
    await lead.save();

    res.status(201).json({
      message: "Lead converted to customer successfully",
      customer,
      lead
    });
  } catch (error) {
    console.error("Lead conversion error:", error.message);

    res.status(500).json({
      message: "Server error while converting lead"
    });
  }
});

module.exports = router;