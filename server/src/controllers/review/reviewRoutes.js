import express from "express";
import { getReviewsByLawyerId } from "./reviewController.js";

const router = express.Router();

// ...existing code...

// Route to get reviews by lawyerId
router.get("/getReviewsByLawyerId/:lawyerId", getReviewsByLawyerId);

// ...existing code...

export default router;
