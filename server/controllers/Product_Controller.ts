import { Request, Response } from "express";
import { addProductService } from "../services/add_Product";

export const createProduct = async (req: Request, res: Response): Promise<Response> => {
    console.log(req.body);
    try {
        const result = await addProductService(req.body);
    
        if (result.success) {
            return res.status(201).json({
                success: true,
                message: result.message || "Product created successfully",
                data: result.data
            });
        }
    
        return res.status(400).json({
            success: false,
            message: result.message || "Failed to create product"
        });
    } catch (error: any) {
        console.error("Error in createProduct:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};


