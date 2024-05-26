import express from "express";
import Category from "../model/category.model.js";
import Product from "../model/product.model.js";

const router = express.Router();

router.post("/products", async (req, res) => {
  try {
    const { name, price, description, imageUrl, categoryId } = req.body;

    const newProduct = new Product({
      name,
      price,
      description,
      imageUrl,
      category: categoryId,
    });

    const savedProduct = await newProduct.save();

    await Category.findByIdAndUpdate(categoryId, {
      $push: { products: savedProduct._id },
    });

    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Error creating product" });
  }
});

router.post("/categories", async (req, res) => {
  try {
    const { name, description } = req.body;

    const newCategory = new Category({
      name,
      description,
    });

    const savedCategory = await newCategory.save();

    res.status(201).json(savedCategory);
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ message: "Error creating category" });
  }
});

router.get("/categories/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).populate(
      "products"
    );

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({ message: "Error fetching category" });
  }
});

export default router;
