const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const User = require("../models/User");

// Get products by user ID

router.get("/users/:id/products", async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ error: "Missing params." });
  }

  const userId = req.params.id;

  try {
    const user = await User.findOne({ userId });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const products = await Product.find({ userId });

    if (products.length === 0) {
      return res
        .status(404)
        .json({ message: "No products found for this user.", products: null });
    }

    res.status(200).json(products);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching user products." });
  }
});

module.exports = router;
