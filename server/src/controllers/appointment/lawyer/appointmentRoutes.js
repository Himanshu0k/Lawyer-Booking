import express from "express";
import appointmentController from "./appointmentController.js";
import { verifyToken } from "../../../middlewares/tokenVarification.js";

const router = express.Router();

// Route to approve an appointment
router.post("/approveAppointment", verifyToken, appointmentController.approveAppointment);

// Route to get all appointments for a lawyer
router.get("/getAppointments", verifyToken, appointmentController.getAllAppointments);

export default router;