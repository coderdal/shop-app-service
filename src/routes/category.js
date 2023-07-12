const express = require("express");
const router = express.Router();
const Category = require("../models/Category");
const authMiddleware = require("../middleware/auth");

// List all categories
router.get("/categories", async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while listing the categories." });
  }
});

// Create a new category (only admin)
router.post("/categories", authMiddleware, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Unauthorized" });
  }

  if (!req.body.name || !req.body.description) {
    return res.status(400).json({ error: "Missing params." });
  }

  try {
    const category = new Category({
      name: req.body.name,
      description: req.body.description || "",
    });
    await category.save();

    res.status(201).json(category);
  } catch (error) {
    res
      .status(400)
      .json({ error: "An error occurred while creating the category." });
  }
});

// Get a specific category
router.get("/categories/:id", async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ error: "Missing params." });
  }

  try {
    const category = await Category.findById(req.params.id);
    if (category) {
      res.status(200).json(category);
    } else {
      res.status(404).json({ error: "Category not found." });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while retrieving the category." });
  }
});

// Update a category (only admin)
router.put("/categories/:id", authMiddleware, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Unauthorized" });
  }

  if (!req.params.id || !req.body.name) {
    return res.status(400).json({ error: "Missing params." });
  }

  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        ...(req.body.description && { description: req.body.description }),
      },
      {
        new: true,
      }
    );

    if (!category) {
      res.status(404).json({ error: "Category not found." });
    }

    res.status(200).json(category);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while updating the category." });
  }
});

// Delete a category (only admin)
router.delete("/categories/:id", authMiddleware, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Unauthorized" });
  }

  if (!req.params.id) {
    return res.status(400).json({ error: "Missing params." });
  }

  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (category) {
      res.status(200).json({ message: "Category successfully deleted." });
    } else {
      res.status(404).json({ error: "Category not found." });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while deleting the category." });
  }
});

module.exports = router;
