import express from 'express';
import { processPayment } from './paymentController.js';

const router = express.Router();

router.post("/processPayment", processPayment);

export default router;