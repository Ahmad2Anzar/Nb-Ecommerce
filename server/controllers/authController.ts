import { Request, Response } from "express";
import * as AuthService from "../services/authServices";

export const signupController = async (req: Request, res: Response) => {
  try {
    const data = await AuthService.signup(req.body);
    res.json(data);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const loginController = async (req: Request, res: Response) => {
  try {
    const data = await AuthService.login(req.body);
    res.json(data);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const forgotPasswordController = async (req: Request, res: Response) => {
    try {
      const { email, newPassword } = req.body;
      const data = await AuthService.forgotPassword({ email, newPassword });     
      
      res.json({
        message: data.message,
      });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  };
