import mongoose from "mongoose";

const appointmentSchema = mongoose.Schema({
  lawyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lawyer",
    required: [true, "Lawyer ID is required"],
    trim: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Ensure this references the User model
    required: [true, "User ID is required"],
    trim: true,
  },
  date: {
    type: String,
    required: [true, "Date is required"], // Ensure date is required
    trim: true
  },
  time: {
    type: String,
    required: [true, "Time is required"], // Ensure time is required
    trim: true
  },
  bookingCause: {
    type: String,
    required: [true, "Booking cause is required"], // Ensure bookingCause is required
    trim: true
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);
export default Appointment;