import { Request, Response } from "express";
import { apiSuccess } from "../utils/apiHandler";


export const indexController = async (req: Request, res: Response) => {
  res.send("Hello World");
}
