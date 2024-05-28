import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    bidAmount: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    imageUrls: {
      type: [String],
      required: true,
    },
    status: {
      type: String,
      enum: ["available", "out of stock", "discontinued"],
      default: "available",
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
