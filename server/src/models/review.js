import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  lawyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lawyer",
    required: true,
  },
  rating: {
    type: String, // Changed from Number to String
    required: true,
    enum: ["1 star", "2 stars", "3 stars", "4 stars", "5 stars"], // Restrict to valid star ratings
  },
  comment: {
    type: String,
    required: true,
    trim: true,
    max: 500,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Review = mongoose.model("Review", reviewSchema);
export default Review;