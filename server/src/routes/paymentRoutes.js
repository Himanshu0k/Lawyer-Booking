import express from "express";
import { createOrder, verifyPayment, processPayment } from "../controllers/payment/paymentController.js";

const router = express.Router();

router.post("/createOrder", createOrder); // Ensure this route is defined
router.post("/verifyPayment", verifyPayment);
router.post("/processPayment", processPayment);

export default router;
