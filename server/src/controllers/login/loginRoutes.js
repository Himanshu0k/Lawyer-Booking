import express from 'express';
// import { loginUser, loginLawyer } from './loginController.js';
import loginController from './loginController.js';
const router = express.Router();

// Route for user login
router.post('/user', loginController.userLogin);

// Route for lawyer login
router.post('/lawyer', loginController.lawyerLogin);

export default router;