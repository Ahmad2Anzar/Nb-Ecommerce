import express from "express";
import { getManagersController, addPaymentController } from "../controllers/adminController";

const adminRouter = express.Router();

adminRouter.get("/managers", getManagersController );
adminRouter.post("/add_payment", addPaymentController);


export default adminRouter;