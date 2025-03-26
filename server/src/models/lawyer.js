import mongoose from "mongoose";

const lawyerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    min: 3,
    max: 50
  },
  dob: {
    type: Date,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    max: 100
  },
  password: {
    type: String,
    required: true,
    trim: true,
    min: 6,
    max: 20
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  specialization: {
    type: String,
    required: true,
    trim: true,
  },
  experience: {
    type: String,
    required: true,
    trim: true,
    min: 5
  },
  fees: {
    type: Number,
    required: true
  },
  role: {
    type: String,
    default: "lawyer", // Default role is "lawyer"
    immutable: true, // Prevent role from being changed
  },
  picturePath: {
    type: String,
    default: "",
  },
});

const Lawyer = mongoose.model("Lawyer", lawyerSchema);
export default Lawyer;