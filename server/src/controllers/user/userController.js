/* global process */

import User from "../../models/user.js";
// import Lawyer from "../../models/lawyer.js";
// import Appointment from "../../models/appointment.js";
import hashPassword from "../../middlewares/password/hashPassword.js";
import response from "../../middlewares/response.js";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY || "your_secret_key";

const userController = {
  /**
   * @swagger
   * /user/addUser:
   *   post:
   *     summary: Add a new user
   *     description: Registers a new user with hashed password.
   *     tags:
   *       - Users
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               email:
   *                 type: string
   *               dob:
   *                 type: string
   *               phoneNumber:
   *                 type: string
   *               address:
   *                 type: string
   *               picturePath:
   *                 type: string
   *               password:
   *                 type: string
   *     responses:
   *       200:
   *         description: User added successfully
   *       400:
   *         description: User already exists
   */
  addUser: async (req, res) => {
    try {
      const { name, email, dob, phoneNumber, address, picturePath, password } = req.body;

      // Check if all required fields are provided
      if (!name || !email || !password || !dob || !phoneNumber || !address) {
        return response.errorResponse(res, "All fields are required");
      }

      // Check if the user already exists
      const userExist = await User.findOne({ email });
      if (userExist) {
        return response.errorResponse(res, "User already exists");
      }

      // Hash the password
      const hashedPassword = await hashPassword(password);

      // Create a new user with the role explicitly set to "user"
      const newUser = new User({
        name,
        email,
        dob,
        phoneNumber,
        address,
        picturePath,
        password: hashedPassword,
        role: "user", // Explicitly set the role to "user"
      });

      await newUser.save();
      return response.successResponse(res, "User added successfully", newUser);
    } catch (error) {
      console.error("Error adding user:", error);
      return response.errorResponse(res, "Internal Server Error");
    }
  },

  /**
   * @swagger
   * /user/getUser:
   *   get:
   *     summary: Get all users
   *     description: Retrieves a list of all users.
   *     tags:
   *       - Users
   *     responses:
   *       200:
   *         description: Users fetched successfully
   */
  getUser: async (req, res) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return response.errorResponse(res, "Access denied, authorization header missing");
      }

      const token = authHeader.split(" ")[1];

      try {
        const decoded = jwt.verify(token, SECRET_KEY);
        const userId = decoded.id;
        // const lawyer = await Lawyer.findById(userId)
        // const appointment = await Appointment.findById({lawyerId : lawyer.id})
        // userId = await Appointment.findById({userId : })

        console.log("User id : " + userId)
        console.log("Role : " + decoded.role)

        if (!userId) {
          return response.errorResponse(res, "Invalid token: user ID is missing");
        }

        const user = await User.findById(userId);
        if (!user) {
          return response.errorResponse(res, "User not found");
        }

        return response.successResponse(res, "User details fetched successfully", user);
      } catch (error) {
        if (error.name === "TokenExpiredError") {
          return response.errorResponse(res, "Token expired. Please log in again.");
        }
        return response.errorResponse(res, "Invalid token");
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      return response.errorResponse(res, "Failed to fetch user details");
    }
  },

  /**
   * @swagger
   * /user/deleteUser:
   *   delete:
   *     summary: Delete a user
   *     description: Deletes a user by email.
   *     tags:
   *       - Users
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *     responses:
   *       200:
   *         description: User deleted successfully
   *       400:
   *         description: User does not exist
   */
  deleteUser: async (req, res) => {
    try {
      const user = await User.findOneAndDelete({ email: req.body.email });
      if (user) {
        return response.successResponse(res, "User deleted successfully", user);
      } else {
        return response.errorResponse(res, "User does not exist");
      }
    } catch (error) {
      return response.errorResponse(res, error.message);
    }
  },

  /**
   * @swagger
   * /user/updateUser:
   *   patch:
   *     summary: Update a user
   *     description: Updates user details by ID.
   *     tags:
   *       - Users
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               userId:
   *                 type: string
   *               name:
   *                 type: string
   *               email:
   *                 type: string
   *               dob:
   *                 type: string
   *               password:
   *                 type: string
   *               phoneNumber:
   *                 type: string
   *               address:
   *                 type: string
   *               picturePath:
   *                 type: string
   *     responses:
   *       200:
   *         description: User updated successfully
   *       400:
   *         description: User already exists with this email
   */
  updateUser: async (req, res) => {
    try {
      const { userId, name, email, dob, password, phoneNumber, address, picturePath } = req.body;
      if (!userId) {
        return response.errorResponse(res, "User ID cannot be empty");
      }
      const userExist = await User.findOne({
        email: email,
        _id: { $ne: userId },
      });
      if (userExist) {
        return response.errorResponse(res, "User already exists with this email");
      }
      const user = await User.findById(userId);
      user.name = name;
      user.email = email;
      user.dob = dob;
      user.password = password;
      user.phoneNumber = phoneNumber;
      user.address = address;
      user.picturePath = picturePath;
      await user.save();
      return response.successResponse(res, "User updated successfully", user);
    } catch (error) {
      return response.errorResponse(res, error.message);
    }
  },
};

export default userController;
