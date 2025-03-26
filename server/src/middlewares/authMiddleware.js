/*global process */
import jwt from "jsonwebtoken"; // Import JWT for token validation

export const validateToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace with your JWT secret
    return decoded;
  } catch (error) {
    console.error("Invalid or expired token:", error);
    return null;
  }
};