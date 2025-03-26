/* global process */
import User from "../../models/user.js";
import Lawyer from "../../models/lawyer.js";
import comparePassword from "../../middlewares/password/comparePassword.js";
// import { generateToken } from "../../middlewares/tokenVarification.js";
import response from "../../middlewares/response.js";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY || "your_secret_key";

const loginController = {
  /**
   * @swagger
   * /login/user:
   *   post:
   *     summary: User login
   *     description: Allows a user to log in with email and password.
   *     tags:
   *       - Login
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *               password:
   *                 type: string
   *     responses:
   *       200:
   *         description: Login successful, returns a JWT token
   *       400:
   *         description: Invalid credentials or user does not exist
   */
  userLogin: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Check if email and password are provided
      if (!email || !password) {
        return response.errorResponse(res, "Email and password are required");
      }

      // Find the user by email
      const user = await User.findOne({ email });
      if (!user) {
        return response.errorResponse(res, "Invalid email or password");
      }

      if (user.role !== "user") {
        return response.errorResponse(res, "Invalid role for user login");
      }

      // Compare the provided password with the stored hashed password
      const isMatch = await comparePassword(password, user.password);
      if (!isMatch) {
        return response.errorResponse(res, "Invalid email or password");
      }

      // Generate a token for the user
      const token = jwt.sign(
        { id: user._id, role: user.role },
        SECRET_KEY,
        { expiresIn: "10h" }
      );

      return response.successResponse(res, "Login successful", { token, user });
    } catch (error) {
      console.error("Error during login:", error);
      return response.errorResponse(res, "Internal Server Error");
    }
  },

  /**
   * @swagger
   * /login/lawyer:
   *   post:
   *     summary: Lawyer login
   *     description: Allows a lawyer to log in with email and password.
   *     tags:
   *       - Login
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *               password:
   *                 type: string
   *     responses:
   *       200:
   *         description: Login successful, returns a JWT token
   *       400:
   *         description: Invalid credentials or lawyer does not exist
   */
  lawyerLogin: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Check if email and password are provided
      if (!email || !password) {
        return response.errorResponse(res, "Email and password are required");
      }

      // Find the lawyer by email
      const lawyer = await Lawyer.findOne({ email });
      if (!lawyer) {
        return response.errorResponse(res, "Invalid email or password");
      }

      if (lawyer.role !== "lawyer") {
        return response.errorResponse(res, "Invalid role for lawyer login");
      }

      // Compare the provided password with the stored hashed password
      const isMatch = await comparePassword(password, lawyer.password);
      if (!isMatch) {
        return response.errorResponse(res, "Invalid email or password");
      }

      // Generate a token for the lawyer
      const token = jwt.sign(
        { id: lawyer._id, role: lawyer.role },
        SECRET_KEY,
        { expiresIn: "10h" }
      );

      return response.successResponse(res, "Login successful", { token, lawyer });
    } catch (error) {
      console.error("Error during lawyer login:", error);
      return response.errorResponse(res, "Internal Server Error");
    }
  },
};

export default loginController;
