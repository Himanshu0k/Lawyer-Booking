import express from 'express';
const router = express.Router();

import {lawyerController} from './lawyerController.js';
import appointmentRoutes from '../appointment/lawyer/appointmentRoutes.js'
import { verifyToken } from '../../middlewares/tokenVarification.js';
import { verifyRole } from '../../middlewares/roleVerification.js';

router.post('/addLawyer', lawyerController.addLawyer)
router.get('/getLawyer', verifyToken, verifyRole(["lawyer"]), lawyerController.getLawyer)
router.delete('/deleteLawyer', verifyToken, verifyRole(["lawyer"]), lawyerController.deleteLawyer)
router.patch('/updateLawyer', verifyToken, verifyRole(["lawyer"]), lawyerController.updateLawyer)
router.use('/appointment', verifyToken, verifyRole(["lawyer"]), appointmentRoutes)

// Route to get all lawyers
router.get("/getAllLawyers", lawyerController.getAllLawyers);
router.get("/searchLawyers", lawyerController.searchLawyers)

export default router;