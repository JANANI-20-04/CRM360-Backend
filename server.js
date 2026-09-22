const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

// Routes
const authRoutes = require("./routes/authRoutes");
const customerRoutes = require("./routes/customerRoutes");
const leadRoutes = require("./routes/leadRoutes");
const taskRoutes = require("./routes/taskRoutes");
// Middleware
const protect = require("./middleware/authMiddleware");

const app = express();

const PORT = process.env.PORT || 5000;


// ==========================================
// MIDDLEWARE
// ==========================================

app.use(cors());

app.use(express.json());


// ==========================================
// AUTH ROUTES
// ==========================================

// Register
// POST /api/auth/register

// Login
// POST /api/auth/login

app.use("/api/auth", authRoutes);


// ==========================================
// CUSTOMER ROUTES
// ==========================================

// Create customer
// POST /api/customers

// Get all customers
// GET /api/customers

// Search customers
// GET /api/customers/search?q=keyword

// Get single customer
// GET /api/customers/:id

// Update customer
// PUT /api/customers/:id

// Delete customer
// DELETE /api/customers/:id

app.use("/api/customers", customerRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/tasks", taskRoutes);

// ==========================================
// HOME ROUTE
// ==========================================

app.get("/", (req, res) => {
  res.json({
    message: "CRM360 Backend is running successfully!"
  });
});


// ==========================================
// PROTECTED TEST ROUTE
// ==========================================

app.get("/api/protected", protect, (req, res) => {
  res.json({
    message: "You accessed a protected CRM360 API!",
    user: req.user
  });
});


// ==========================================
// MONGODB CONNECTION
// ==========================================

mongoose
  .connect(process.env.MONGODB_URI, {
    family: 4,
    serverSelectionTimeoutMS: 10000
  })
  .then(() => {
    console.log("MongoDB connected successfully!");

    app.listen(PORT, () => {
      console.log(
        `CRM360 Backend running on http://localhost:${PORT}`
      );
    });
  })
  .catch((error) => {
    console.error(
      "MongoDB connection failed:",
      error.message
    );
  });