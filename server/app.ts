import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import logger from "morgan";
import routes from "./routes/index";
import { connectDB } from "./db";
import { apiFailure } from "./utils/apiHandler";
import dotenv from "dotenv";
dotenv.config();

const app = express();

// Connect to the database
connectDB();

// Middleware
app.use(cors()); // Enable CORS for all requests
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Routes
app.use("/api", routes);

// Handle unhandled routes
app.use("*", (req, res) => {
  apiFailure(res, "Route not found");
});

export default app;