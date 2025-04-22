import express, { Request, Response } from "express";
import { createProduct } from "../controllers/Product_Controller";

const productRoutes = express.Router();

productRoutes.post("/", async (req: Request, res: Response) => {
    await createProduct(req, res);
});

export default productRoutes;
