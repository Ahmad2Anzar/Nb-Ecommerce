import { Request, Response } from "express";
import { getManagersService, addPaymentService } from "../services/adminServices";


export const getManagersController = async (req: Request, res: Response) => {
  try {
    const dataa = await getManagersService();
    res.json(dataa);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const addPaymentController = async (req: Request, res: Response) => {
    
    const {managerId , ratePerDay, validity} = req.body
    try {
      const data = await addPaymentService(managerId , ratePerDay, validity);
      res.json(data);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  };