import Appointment from "../../../models/appointment.js";
import response from "../../../middlewares/response.js";
import Review from "../../../models/review.js"; // Import the Review model
import User from "../../../models/user.js";

const appointmentController = {
  /**
   * @swagger
   * /user/appointment/bookAppointment:
   *   post:
   *     summary: Book an appointment
   *     description: Allows a user to book an appointment with a lawyer.
   *     tags:
   *       - Appointments
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               lawyerId:
   *                 type: string
   *               date:
   *                 type: string
   *               time:
   *                 type: string
   *     responses:
   *       200:
   *         description: Appointment booked successfully
   *       400:
   *         description: Bad request due to invalid input
   */
  bookAppointment: async (req, res) => {
    try {
      const { lawyerId, date, time, bookingCause } = req.body; // Removed userId from request body
      const userId = req.userId; // Get userId from the logged-in user

      if (!lawyerId || !userId || !date || !time || !bookingCause) {
        return response.errorResponse(res, "All fields are required");
      }

      // Check if the appointment slot is already booked
      const appointmentDateTime = `${date}T${time}`;
      const existingAppointment = await Appointment.findOne({ lawyerId, appointmentDateTime });
      if (existingAppointment) {
        return response.errorResponse(res, "The selected lawyer is not available at the chosen time.");
      }

      // Create a new appointment
      const newAppointment = new Appointment({
        userId, // Use the userId from the logged-in user
        lawyerId,
        date,
        time,
        bookingCause,
      });

      await newAppointment.save();
      return response.successResponse(res, "Appointment booked successfully", newAppointment);
    } catch (error) {
      console.error("Error booking appointment:", error);
      return response.errorResponse(res, "Failed to book appointment");
    }
  },

  /**
   * @swagger
   * /user/appointment/getAppointment:
   *   get:
   *     summary: Get all appointments for a user
   *     description: Retrieves all appointments associated with a user based on their email.
   *     tags:
   *       - Appointments
   *     parameters:
   *       - in: body
   *         name: email
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: List of all appointments
   *       400:
   *         description: User does not exist
   */
  getAppointments: async (req, res) => {
    try {
      if (!req.userId || req.user.role !== "user") {
        return response.errorResponse(res, "Access denied, invalid role or user ID");
      }

      const appointments = await Appointment.find({ userId: req.userId }).populate("lawyerId", "name specialization");
      return response.successResponse(res, "Appointments fetched successfully", appointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      return response.errorResponse(res, "Failed to fetch appointments");
    }
  },

  /**
   * @swagger
   * /user/appointment/updateAppointment:
   *   patch:
   *     summary: Update an appointment
   *     description: Allows a user to update an existing appointment.
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
   *               date:
   *                 type: string
   *               time:
   *                 type: string
   *               bookingCause:
   *                 type: string
   *     responses:
   *       200:
   *         description: Appointment updated successfully
   *       400:
   *         description: Appointment cannot be booked on the required schedule
   */
  updateAppointment: async (req, res) => {
    try {
      const { appointmentId, date, time, bookingCause } = req.body;

      // Validate required fields
      if (!appointmentId || !date || !time || !bookingCause) {
        return response.errorResponse(res, "All fields are required");
      }

      // Find and update the appointment
      const updatedAppointment = await Appointment.findByIdAndUpdate(
        appointmentId,
        { date, time, bookingCause },
        { new: true } // Return the updated document
      );

      if (!updatedAppointment) {
        return response.errorResponse(res, "Appointment not found");
      }

      return response.successResponse(res, "Appointment updated successfully", updatedAppointment);
    } catch (error) {
      console.error("Error updating appointment:", error);
      return response.errorResponse(res, "Failed to update appointment");
    }
  },

  /**
   * @swagger
   * /user/appointment/deleteAppointment:
   *   delete:
   *     summary: Delete an appointment
   *     description: Deletes an existing appointment by ID.
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
   *     responses:
   *       200:
   *         description: Appointment deleted successfully
   *       400:
   *         description: Appointment not found
   */
  deleteAppointment: async (req, res) => {
    try {
      const { appointmentId } = req.body;

      const deletedAppointment = await Appointment.findByIdAndDelete(appointmentId);
      if (!deletedAppointment) {
        return response.errorResponse(res, "Appointment not found");
      }

      return response.successResponse(res, "Appointment deleted successfully", deletedAppointment);
    } catch (error) {
      console.error("Error deleting appointment:", error);
      return response.errorResponse(res, "Failed to delete appointment");
    }
  },

  getAppointmentById: async (req, res) => {
    try {
      const { appointmentId } = req.params; // Extract appointment ID from params
      const appointment = await Appointment.findById(appointmentId).populate("lawyerId", "name specialization");
      if (!appointment) {
        return response.errorResponse(res, "Appointment not found");
      }
      return response.successResponse(res, "Appointment fetched successfully", appointment);
    } catch (error) {
      console.error("Error fetching appointment:", error);
      return response.errorResponse(res, "Failed to fetch appointment");
    }
  },

  /**
   * @swagger
   * /user/review/addReview:
   *   post:
   *     summary: Add a review for a lawyer
   *     description: Allows a user to add a review for a lawyer after an appointment.
   *     tags:
   *       - Reviews
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               lawyerId:
   *                 type: string
   *               rating:
   *                 type: number
   *               comment:
   *                 type: string
   *     responses:
   *       200:
   *         description: Review added successfully
   *       400:
   *         description: Bad request due to invalid input
   */
  addReview: async (req, res) => {
    try {
        const { lawyerId, rating, comment } = req.body;
        const userId = req.userId;

        // Fetch user details
        const user = await User.findById(userId);
        if (!user) {
            return response.errorResponse(res, "User not found");
        }

        console.log(
            "Name : " + user.name,
            "User : " + userId,
            "Lawyer : " + lawyerId,
            "Rating : " + rating,
            "Comment : " + comment
        );

        if (!lawyerId || !rating || !comment) {
            return response.errorResponse(res, "All fields are required");
        }

        // Check if the user has an approved and past appointment with the lawyer
        const pastAppointment = await Appointment.findOne({
            userId,
            lawyerId,
            status: "approved",
            date: { $lt: new Date() },
        });

        if (!pastAppointment) {
            return response.errorResponse(res, "You can only review lawyers for past approved appointments");
        }

        // Use findOneAndUpdate to either update an existing review or create a new one
        const updatedReview = await Review.findOneAndUpdate(
            { userId, lawyerId },  // Search criteria
            { 
                userName: user.name,
                rating,
                comment
            },  
            { 
                new: true,  // Return the updated document
                upsert: true,  // Create a new review if none exists
                runValidators: true  // Ensure validation rules are applied
            }
        );

        return response.successResponse(res, "Review submitted successfully", updatedReview);
    } catch (error) {
        console.error("Error adding/updating review:", error);
        return response.errorResponse(res, "Failed to submit review");
    }
},

};

export default appointmentController;
