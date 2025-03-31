import express from 'express';
const router = express.Router();

import userController from './userController.js';
import appointmentRoutes from '../appointment/user/appointmentRoutes.js';
import { verifyToken } from '../../middlewares/tokenVarification.js';
import { verifyRole } from '../../middlewares/roleVerification.js';

// Route for user signup
router.post('/addUser', userController.addUser);

// router.post("/api/users/signup", userController.addUser);
router.get('/getUser', verifyToken, userController.getUser);
router.get('/getUserById/:userId', userController.getUserById);
router.delete('/deleteUser', verifyToken, verifyRole(["user"]), userController.deleteUser);
router.patch('/updateUser', verifyToken, verifyRole(["user"]), userController.updateUser);

// Integrate appointment routes
router.use('/appointment', verifyToken, appointmentRoutes); // Ensure appointment routes are connected

export default router;