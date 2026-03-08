const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

const LOW_STOCK_LIMIT = 10;

// Add Product
router.post("/", async (req, res) => {
  try {
    const { name, price, quantity } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Product name should not be empty" });
    }

    if (price === undefined || Number(price) <= 0) {
      return res.status(400).json({ message: "Price must be positive" });
    }

    if (quantity === undefined || Number(quantity) < 0) {
      return res.status(400).json({ message: "Quantity cannot be negative" });
    }

    const product = await Product.create({
      name: name.trim(),
      price: Number(price),
      quantity: Number(quantity)
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("POST /products error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
});

// Get All Products / Low Stock Products
router.get("/", async (req, res) => {
  try {
    const { lowStock } = req.query;

    let products;

    if (lowStock === "true") {
      products = await Product.find({ quantity: { $lte: LOW_STOCK_LIMIT } }).sort({ quantity: 1 });
    } else {
      products = await Product.find().sort({ createdAt: -1 });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error("GET /products error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
});

// Update Product Quantity
router.put("/:id", async (req, res) => {
  try {
    const { quantity } = req.body;

    if (quantity === undefined || Number(quantity) < 0) {
      return res.status(400).json({ message: "Quantity cannot be negative" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { quantity: Number(quantity) },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("PUT /products/:id error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
});

module.exports = router;