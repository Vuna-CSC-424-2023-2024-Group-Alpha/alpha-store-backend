import express from "express";
import Category from "../model/category.model.js";
import Product from "../model/product.model.js";
import Rating from "../model/rating.model.js";
import { verifyJwtToken } from "../utilities/handleAuthToken.js";

import uploadImageToCloudinary from "../utilities/uploadImageToCloudinary.js";
import multer from "multer";
import User from "../model/user.model.js";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/products", upload.array("images", 10), async (req, res) => {
  try {
    const { name, bidAmount, description, categoryId } = req.body;
    const imageFiles = req.files;

    if (!imageFiles || imageFiles.length === 0) {
      return res.status(400).json({ message: "No images uploaded" });
    }

    const imageUploadPromises = imageFiles.map((imageFile) =>
      uploadImageToCloudinary(imageFile.buffer, imageFile.originalname)
    );

    const cloudinaryResults = await Promise.all(imageUploadPromises);
    const imageUrls = cloudinaryResults.map((result) => result.secure_url);

    const newProduct = new Product({
      name,
      bidAmount,
      description,
      imageUrls,
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

router.patch("/product/status/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        message: "Product Not Found",
      });
    }

    product.status = status;
    await product.save();
    res.status(200).json({
      message: `Status changed successfully to ${status}`,
    });
  } catch (error) {
    console.error("Error updating product status:", error);
    res.status(500).json({ message: "Error updating product status" });
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
    const { page, limit } = req.query;
    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const totalProducts = await Product.countDocuments({
      category: id,
    });
    const totalPages = Math.ceil(totalProducts / limit);

    const products = await Product.find({ category: id })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json({
      category: {
        ...category.toObject(),
        products,
      },
      pagination: {
        totalProducts,
        totalPages,
        currentPage: Number(page),
        pageSize: Number(limit),
      },
    });
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({ message: "Error fetching category" });
  }
});

router.get("/rating/:revieweeId", async (req, res) => {
  try {
    const { revieweeId } = req.params;
    const reviews = await Rating.find({ reviewee: revieweeId })
      .populate("reviewer", "firstName lastName profilePicture")
      .populate("reviewee", "firstName lastName profilePicture");

    if (!reviews || reviews.length === 0) {
      return res.status(404).json({
        message: "No reviews found for this user",
      });
    }

    return res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching user ratings:", error);
    res.status(500).json({ message: "Error fetching user ratings" });
  }
});

router.post("/rating/:revieweeId", verifyJwtToken, async (req, res) => {
  try {
    const userId = req.userId;
    const { review, rating } = req.body;
    const { revieweeId } = req.params;

    if (!review || rating == null) {
      return res
        .status(400)
        .json({ message: "Review and rating are required" });
    }

    if (![0, 1, 2, 3, 4, 5].includes(rating)) {
      return res
        .status(400)
        .json({ message: "Rating must be between 0 and 5" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const existingRating = await Rating.findOne({
      reviewer: userId,
      reviewee: revieweeId,
    });
    if (existingRating) {
      return res.status(400).json({
        message: "You have already rated this user",
      });
    }

    const newRating = new Rating({
      review,
      rating,
      reviewer: userId,
      reviewee: revieweeId,
    });

    const savedRating = await newRating.save();

    return res.status(201).json({
      message: "Rating submitted successfully",
      rating: savedRating,
    });
  } catch (error) {
    console.error("Error rating user:", error);
    res.status(500).json({ message: "Error rating user" });
  }
});

export default router;
