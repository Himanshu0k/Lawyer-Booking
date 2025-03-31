import express from "express";
import { getReviewsByLawyerId } from "./reviewController.js";

const router = express.Router();

// Route to get reviews by lawyerId
router.get("/getReviewsByLawyerId/:lawyerId", getReviewsByLawyerId);

// router.get("/getUsername", getUsername);

export default router;
