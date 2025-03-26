import express from 'express';
const router = express.Router();

import lawyerRoutes from '../controllers/lawyer/lawyerRoutes.js'
import loginRoutes from '../controllers/login/loginRoutes.js'
import userRoutes from '../controllers/user/userRoutes.js'
// import userController from "../controllers/userController.js";

router.use('/lawyer', lawyerRoutes)
router.use('/login', loginRoutes)
router.use('/user', userRoutes)

// Add a route for user signup
// router.post("/api/users/signup", userController.addUser);

export default router;