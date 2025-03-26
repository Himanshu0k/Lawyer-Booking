import express from "express";
import { getUser } from "../controllers/user/userController.js";
import { verifyToken } from "../../middlewares/tokenVarification.js";

const router = express.Router();

router.get("/getUser", verifyToken, getUser);

export default router;
