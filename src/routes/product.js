const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const authMiddleware = require("../middleware/auth");

// List all products
router.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while listing the products." });
  }
});

// Create a new product (admin and user)
router.post("/products", authMiddleware, async (req, res) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({ error: "Missing params." });
  }

  try {
    const product = new Product({
      name: req.body.name,
      price: req.body.price,
      authorId: req.user.userId,
    });

    await product.save();

    res.status(201).json(product);
  } catch (error) {
    res
      .status(400)
      .json({ error: "An error occurred while creating the product." });
  }
});

// Get a specific product
router.get("/products/:id", async (req, res) => {
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

// Update a product (admin and user->who added the product)
router.put("/products/:id", authMiddleware, async (req, res) => {
  if (!req.params.id || !req.body) {
    return res.status(400).json({ error: "Missing params." });
  }

  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }

    if (
      req.user.role !== "admin" ||
      product.authorId.toString() !== req.user.userId
    ) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    req.body.name ? (product.name = req.body.name) : null;
    req.body.price ? (product.price = req.body.price) : null;
    req.body.imageUrl ? (product.imageUrl = req.body.imageUrl) : null;
    req.body.description ? (product.description = req.body.description) : null;
    req.body.category ? (product.category = req.body.category) : null;

    const updatedProduct = await product.save();

    res.status(200).json(updatedProduct);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while updating the product." });
  }
});

// Delete a product (admin and user->who added the product)
router.delete("/products/:id", authMiddleware, async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ error: "Missing params." });
  }

  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }

    if (
      req.user.role !== "admin" ||
      product.authorId.toString() !== req.user.userId
    ) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    res.status(200).json(deletedProduct);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while deleting the product." });
  }
});

module.exports = router;
