import express from "express";
import appointmentController from "./appointmentController.js";
import { verifyToken } from "../../../middlewares/tokenVarification.js";

const router = express.Router();

// Route to get all appointments for a user
router.get("/getAppointments", verifyToken, appointmentController.getAppointments);

// Route to book a new appointment
router.post("/bookAppointment", verifyToken, appointmentController.bookAppointment);

// Route to update an existing appointment
router.patch("/updateAppointment", verifyToken, appointmentController.updateAppointment);

// Route to delete an appointment
router.delete("/deleteAppointment", verifyToken, appointmentController.deleteAppointment);

// Route to get a single appointment by its ID
router.get("/getAppointment/:appointmentId", verifyToken, appointmentController.getAppointmentById);

export default router;
