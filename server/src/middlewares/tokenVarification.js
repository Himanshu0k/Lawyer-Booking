// JWT authentication and authorisation
/* global process */
import jwt from 'jsonwebtoken';
import response from './response.js';

const SECRET_KEY = process.env.SECRET_KEY || 'your_secret_key';

// Generate Token
const generateToken = (payload) => {
   return jwt.sign(payload, SECRET_KEY, { expiresIn: '10h' });
};

// Middleware to Verify Token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("Token : " + authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return response.errorResponse(res, "Access denied, authorization header missing");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; // Attach decoded token data to the request
    console.log("Token verified successfully:", decoded); // Debugging log

    // Attach userId or lawyerId based on the role
    if (decoded.role === "user") {
      req.userId = decoded.id;
    } else if (decoded.role === "lawyer") {
      req.lawyerId = decoded.id;
    }

    if (!req.userId && !req.lawyerId) {
      return response.errorResponse(res, "Access denied: user or lawyer ID is missing");
    }

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      console.error("Token verification failed: Token expired");
      return response.errorResponse(res, "Token expired. Please log in again.");
    }
    console.error("Token verification failed:", error);
    return response.errorResponse(res, "Invalid or expired token");
  }
};

export { generateToken, verifyToken };
