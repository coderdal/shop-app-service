const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const authMiddleware = require("../middleware/auth");

// List all products
router.get("/products", authMiddleware, async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while listing the products." });
  }
});

// Create a new product
router.post("/products", authMiddleware, async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res
      .status(400)
      .json({ error: "An error occurred while creating the product." });
  }
});

// Get a specific product
router.get("/products/:id", authMiddleware, async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ error: "Missing params." });
  }

  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ error: "Product not found." });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while retrieving the product." });
  }
});

// Update a product
router.put("/products/:id", authMiddleware, async (req, res) => {
  if (!req.params.id || !req.body) {
    return res.status(400).json({ error: "Missing params." });
  }

  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ error: "Product not found." });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while updating the product." });
  }
});

// Delete a product
router.delete("/products/:id", authMiddleware, async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ error: "Missing params." });
  }

  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (product) {
      res.status(200).json({ message: "Product successfully deleted." });
    } else {
      res.status(404).json({ error: "Product not found." });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while deleting the product." });
  }
});

module.exports = router;
