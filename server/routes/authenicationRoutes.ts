import express from "express";
import {
  signupController,
  loginController,
  forgotPasswordController,
} from "../controllers/authController";

const authRouter = express.Router();

authRouter.post("/signup", signupController);
authRouter.post("/login", loginController);
authRouter.post("/forgot-password",forgotPasswordController);

export default authRouter;