import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import indexRoutes from "./routes/index.js"; // Import main index routes
import apiIndexRoutes from "./routes/api/index.js"; // Import api index routes

dotenv.config();

const allowedOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:4200'; // Frontend origin

const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Enable CORS for Express API
app.use(cors({
    origin: allowedOrigin, // Allows your frontend app to communicate with the backend
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Restrict allowed methods
    credentials: true // Enable cookies if needed
}));

// Use the central routes (index routes)
app.use('/', indexRoutes); // Main Routes
app.use('/api', apiIndexRoutes); // API routes

export default app;
