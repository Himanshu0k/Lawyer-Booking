import express from 'express';
const router = express.Router();

import lawyerRoutes from '../controllers/lawyer/lawyerRoutes.js'
import loginRoutes from '../controllers/login/loginRoutes.js'
import userRoutes from '../controllers/user/userRoutes.js'
import paymentRoutes from '../controllers/payment/paymentRoutes.js'
import reviewRoutes from '../controllers/review/reviewRoutes.js'

router.use('/lawyer', lawyerRoutes)
router.use('/login', loginRoutes)
router.use('/user', userRoutes)
router.use("/payment", paymentRoutes);
router.use("/review", reviewRoutes)

export default router;