import Lawyer from '../../models/lawyer.js';
import response from '../../middlewares/response.js';
import hashPassword from '../../middlewares/password/hashPassword.js';
import multer from "multer";
// import path from "path";

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save files to the "uploads" directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

const lawyerController = {
  getAllLawyers: async (req, res) => {
    try {
      const lawyers = await Lawyer.find();
      return response.successResponse(res, "Lawyers fetched successfully", lawyers);
    } catch (error) {
      console.error("Error fetching lawyers:", error);
      return response.errorResponse(res, "Failed to fetch lawyers");
    }
  },

  /**
   * @swagger
   * /lawyer/addLawyer:
   *   post:
   *     summary: Add a new lawyer
   *     description: Registers a new lawyer if they don't already exist.
   *     tags:
   *       - Lawyers
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
   *               password:
   *                 type: string
   *               dob:
   *                 type: string
   *               phoneNumber:
   *                 type: string
   *               address:
   *                 type: string
   *               picturePath:
   *                 type: string
   *               fees:
   *                 type: number
   *               experience:
   *                 type: number
   *     responses:
   *       200:
   *         description: Lawyer added successfully
   *       400:
   *         description: Lawyer already exists
   */
  addLawyer: async (req, res) => {
    try {
      console.log("Incoming request body:", req.body); // Log the request body for debugging

      const { name, email, password, dob, phoneNumber, address, specialization, experience, fees } = req.body;

      // Check if the lawyer already exists
      const existLawyer = await Lawyer.findOne({ email });
      if (existLawyer) {
        return response.errorResponse(res, "Lawyer already exists");
      }

      // Hash the password
      const hashedPassword = await hashPassword(password);

      // Create a new lawyer
      const newLawyer = new Lawyer({
        name,
        email,
        password: hashedPassword,
        dob,
        phoneNumber,
        address,
        specialization,
        experience, // Include experience
        fees,
      });

      await newLawyer.save();
      return response.successResponse(res, "Lawyer added successfully", newLawyer);
    } catch (error) {
      console.error("Error adding lawyer:", error);
      return response.errorResponse(res, "Internal Server Error");
    }
  },

  /**
   * @swagger
   * /lawyer/getLawyer:
   *   get:
   *     summary: Get all lawyers
   *     description: Retrieves all registered lawyers.
   *     tags:
   *       - Lawyers
   *     responses:
   *       200:
   *         description: List of all lawyers
   */
  getLawyer: async (req, res) => {
    try {
      if (!req.lawyerId || req.user.role !== "lawyer") {
        console.log(`Lawyer Id : ${req.lawyerId}, Role : ${req.user.role}`)
        return response.errorResponse(res, "Access denied, invalid role or lawyer ID");
      }
  
      const lawyer = await Lawyer.findById(req.lawyerId);
      if (!lawyer) {
        return response.errorResponse(res, "Lawyer not found");
      }
  
      return response.successResponse(res, "Lawyer details fetched successfully", lawyer);
    } catch (error) {
      console.error("Error fetching lawyer details:", error);
      return response.errorResponse(res, "Failed to fetch lawyer details");
    }
  },

  /**
   * @swagger
   * /lawyer/deleteLawyer:
   *   delete:
   *     summary: Delete a lawyer
   *     description: Deletes a lawyer by email.
   *     tags:
   *       - Lawyers
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
   *         description: Lawyer deleted successfully
   *       400:
   *         description: Lawyer does not exist
   */
  deleteLawyer: async (req, res) => {
    try {
      const lawyer = await Lawyer.findOneAndDelete({ email: req.body.email });
      if (!lawyer) {
        return response.errorResponse(res, 'Lawyer does not exist');
      }
      return response.successResponse(res, 'Lawyer deleted successfully', lawyer);
    } catch (error) {
      return response.errorResponse(res, error.message);
    }
  },

  /**
   * @swagger
   * /lawyer/updateLawyer:
   *   patch:
   *     summary: Update lawyer details
   *     description: Updates information of an existing lawyer by ID.
   *     tags:
   *       - Lawyers
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               lawyerId:
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
   *               fees:
   *                 type: number
   *               experience:
   *                 type: number
   *     responses:
   *       200:
   *         description: Lawyer updated successfully
   *       400:
   *         description: Lawyer not found or email already in use
   */
  updateLawyer: async (req, res) => {
    try {
      const lawyerId = req.user.id; // Extract lawyer ID from token
      const updatedData = req.body;

      const lawyer = await Lawyer.findByIdAndUpdate(lawyerId, updatedData, { new: true });
      if (!lawyer) {
        return response.errorResponse(res, "Lawyer not found");
      }

      return response.successResponse(res, "Lawyer details updated successfully", lawyer);
    } catch (error) {
      console.error("Error updating lawyer details:", error);
      return response.errorResponse(res, "Failed to update lawyer details");
    }
  },

  /**
   * @swagger
   * /lawyer/getLawyerById:
   *   get:
   *     summary: Get lawyer by ID
   *     description: Fetch a lawyer's profile using their ID.
   *     tags:
   *       - Lawyers
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               lawyerId:
   *                 type: string
   *     responses:
   *       200:
   *         description: Lawyer found successfully
   *       400:
   *         description: Lawyer not found
   */
  getLawyerById: async (req, res) => {
    try {
        const { lawyerId } = req.params; // Use params instead of body for ID
        const lawyer = await Lawyer.findById(lawyerId); // Populate comments if needed
        if (!lawyer) {
            return response.errorResponse(res, "Lawyer not found");
        }
        return response.successResponse(res, "Lawyer found successfully", lawyer);
    } catch (error) {
        console.error("Error fetching lawyer by ID:", error);
        return response.errorResponse(res, "Failed to fetch lawyer by ID");
    }
},

  /**
   * @swagger
   * /lawyer/getLawyerByName:
   *   get:
   *     summary: Get lawyer by name
   *     description: Fetch lawyers by a partial or full name search.
   *     tags:
   *       - Lawyers
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               lawyerName:
   *                 type: string
   *     responses:
   *       200:
   *         description: Lawyers found
   *       400:
   *         description: No lawyers found
   */
  getLawyerByName: async (req, res) => {
    try {
      const { lawyerName } = req.body;
      if (!lawyerName) {
        return response.errorResponse(res, "Lawyer name is required");
      }
      const lawyers = await Lawyer.find({ name: { $regex: new RegExp(lawyerName, "i") } });
      if (lawyers.length > 0) {
        return response.successResponse(res, "Lawyers found", lawyers);
      }
      return response.errorResponse(res, "No lawyers found with this name");
    } catch (error) {
      return response.errorResponse(res, error.message);
    }
  },

  uploadProfilePicture: async (req, res) => {
    try {
      const lawyerId = req.user.id; // Extract lawyer ID from token
      const picturePath = req.file.path; // Get the uploaded file path

      const lawyer = await Lawyer.findByIdAndUpdate(
        lawyerId,
        { picturePath },
        { new: true }
      );

      if (!lawyer) {
        return response.errorResponse(res, "Lawyer not found");
      }

      return response.successResponse(res, "Profile picture updated successfully", { picturePath });
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      return response.errorResponse(res, "Failed to upload profile picture");
    }
  },

  searchLawyers: async (req, res) => {
    try {
      const { name, specialization, area } = req.query;

      const query = {};
      if (name) query.name = { $regex: new RegExp(name, "i") };
      if (specialization) query.specialization = { $regex: new RegExp(specialization, "i") };
      if (area) query.address = { $regex: new RegExp(area, "i") };

      const lawyers = await Lawyer.find(query);
      return response.successResponse(res, "Lawyers fetched successfully", lawyers);
    } catch (error) {
      console.error("Error searching lawyers:", error);
      return response.errorResponse(res, "Failed to search lawyers");
    }
  },
};

export const signupLawyer = async (req, res) => {
  try {
    const { name, email, password, ...otherDetails } = req.body;

    // Check if the lawyer already exists
    const existingLawyer = await Lawyer.findOne({ email });
    if (existingLawyer) {
      return response.errorResponse(res, "Lawyer already exists");
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create a new lawyer with the role explicitly set to "lawyer"
    const newLawyer = new Lawyer({
      name,
      email,
      password: hashedPassword,
      role: "lawyer", // Explicitly set the role to "lawyer"
      ...otherDetails,
    });

    await newLawyer.save();
    return response.successResponse(res, "Lawyer registered successfully", newLawyer);
  } catch (error) {
    console.error("Error during lawyer signup:", error);
    return response.errorResponse(res, "Failed to register lawyer");
  }
};

export const getLawyer = async (req, res) => {
  try {
    if (!req.lawyerId) {
      return response.errorResponse(res, "Access denied: lawyer ID is missing");
    }

    const lawyer = await Lawyer.findById(req.lawyerId);
    if (!lawyer) {
      return response.errorResponse(res, "Lawyer not found");
    }

    return response.successResponse(res, "Lawyer details fetched successfully", lawyer);
  } catch (error) {
    console.error("Error fetching lawyer details:", error);
    return response.errorResponse(res, "Failed to fetch lawyer details");
  }
};

export { upload, lawyerController }; // Ensure named exports
