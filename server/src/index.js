/* global process */
// import express from "express";
// import router from "./routes/routes.js";
// import connectDB from "./config/db.js";
// import dotenv from 'dotenv';
// dotenv.config();

// const app = express();

// app.use(express.json());
// connectDB();

// app.use("/", router);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//    console.log(`🚀 Server is running on port ${PORT}`);
// });

import express from "express";
import router from "./routes/routes.js";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { swaggerOptions } from "./middlewares/swagger.js";
import cors from "cors";
// import paymentRoutes from "./routes/paymentRoutes.js"; // Import payment routes
// import { validateAuthTokens } from "./middlewares/authMiddleware.js"; // Import middleware

dotenv.config();
const app = express();

app.use(cors()); // Enable CORS
app.use(express.json());
connectDB();

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use("/", router);
// app.use("/payment", paymentRoutes); // Add this line to register payment routes

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
   console.log(`🚀 Server is running on http://localhost:${PORT}`);
   console.log(`📄 Swagger Docs available at http://localhost:${PORT}/api-docs`);
});
