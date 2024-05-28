import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema({
  rating: {
    type: Number,
    enum: [0, 1, 2, 3, 4, 5],
    default: 0,
    required: true,
  },
  review: {
    type: String,
    required: true,
  },
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  reviewee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Rating = mongoose.model("Rating", ratingSchema);

export default Rating;
