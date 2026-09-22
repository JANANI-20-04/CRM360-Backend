const express = require("express");
const Task = require("../models/Task");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// CREATE TASK
router.post("/", protect, async (req, res) => {
  try {
    const {
      title,
      related,
      assignee,
      due,
      priority,
      status
    } = req.body;

    if (!title) {
      return res.status(400).json({
        message: "Task title is required"
      });
    }

    const task = await Task.create({
      title,
      related,
      assignee,
      due,
      priority,
      status
    });

    const populatedTask = await Task.findById(task._id)
      .populate("assignee", "name email role");

    res.status(201).json({
      message: "Task created successfully",
      task: populatedTask
    });

  } catch (error) {
    console.error("Create task error:", error.message);

    res.status(500).json({
      message: "Server error while creating task"
    });
  }
});

// GET ALL TASKS
router.get("/", protect, async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("assignee", "name email role")
      .sort({ createdAt: -1 });

    res.json({
      count: tasks.length,
      tasks
    });

  } catch (error) {
    console.error("Get tasks error:", error.message);

    res.status(500).json({
      message: "Server error while fetching tasks"
    });
  }
});

// GET ONE TASK
router.get("/:id", protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("assignee", "name email role");

    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    res.json({
      task
    });

  } catch (error) {
    console.error("Get task error:", error.message);

    res.status(500).json({
      message: "Server error while fetching task"
    });
  }
});

// UPDATE TASK
router.put("/:id", protect, async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate("assignee", "name email role");

    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    res.json({
      message: "Task updated successfully",
      task
    });

  } catch (error) {
    console.error("Update task error:", error.message);

    res.status(500).json({
      message: "Server error while updating task"
    });
  }
});

// DELETE TASK
router.delete("/:id", protect, async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    res.json({
      message: "Task deleted successfully"
    });

  } catch (error) {
    console.error("Delete task error:", error.message);

    res.status(500).json({
      message: "Server error while deleting task"
    });
  }
});

module.exports = router;