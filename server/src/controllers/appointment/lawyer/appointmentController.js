import Appointment from "../../../models/appointment.js";
import response from "../../../middlewares/response.js";

/**
 * @swagger
 * /lawyer/appointment/approveAppointment:
 *   post:
 *     summary: Approve an appointment
 *     description: Approves an appointment if the lawyer is authorized and the appointment exists.
 *     tags:
 *       - Appointments
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               appointmentId:
 *                 type: string
 *                 description: ID of the appointment
 *               lawyerId:
 *                 type: string
 *                 description: ID of the lawyer
 *     responses:
 *       200:
 *         description: Appointment approved successfully
 *       400:
 *         description: Bad request due to missing parameters or invalid authorization
 *       500:
 *         description: Server error
 */
const appointmentController = {
  /**
   * Approve an appointment
   */
  approveAppointment: async (req, res) => {
    try {
      const { appointmentId } = req.body;

      if (!appointmentId) {
        return response.errorResponse(res, "Appointment ID is required");
      }

      const appointment = await Appointment.findById(appointmentId);
      if (!appointment) {
        return response.errorResponse(res, "Appointment not found");
      }

      if (appointment.status === "approved") {
        return response.errorResponse(res, "Appointment is already approved");
      }

      appointment.status = "approved";
      await appointment.save();

      return response.successResponse(res, "Appointment approved successfully", appointment);
    } catch (error) {
      console.error("Error approving appointment:", error);
      return response.errorResponse(res, "Failed to approve appointment");
    }
  },

  /**
   * @swagger
   * /lawyer/appointment/getAppointment:
   *   get:
   *     summary: Get all appointments for a lawyer
   *     description: Retrieves all appointments associated with a lawyer based on their email.
   *     tags:
   *       - Appointments
   *     parameters:
   *       - in: body
   *         name: email
   *         required: true
   *         schema:
   *           type: string
   *           description: Lawyer's email
   *     responses:
   *       200:
 *         description: List of all appointments
 *       400:
 *         description: Lawyer does not exist
 *       404:
 *         description: No appointments found
 *       500:
 *         description: Server error
 */
  getAllAppointments: async (req, res) => {
    try {
      const lawyerId = req.user.id; // Extract lawyer ID from token
      const appointments = await Appointment.find({ lawyerId }).populate("userId", "name email");
      return response.successResponse(res, "Appointments fetched successfully", appointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      return response.errorResponse(res, "Failed to fetch appointments");
    }
  },
};

export default appointmentController;
