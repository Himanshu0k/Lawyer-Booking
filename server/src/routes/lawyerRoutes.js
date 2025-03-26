import express from "express";
import { upload, lawyerController } from "../controllers/lawyer/lawyerController.js"; // Correctly import named exports
import { verifyToken } from "../../middlewares/tokenVarification.js";

const router = express.Router();

// ...existing routes...

router.post(
  "/uploadProfilePicture",
  verifyToken,
  upload.single("file"),
  lawyerController.uploadProfilePicture
);

// router.get("/searchLawyers", lawyerController.searchLawyers);

export default router;
