import express from "express";
import {  indexController } from "../controllers/indexController";
import productRoutes from "./productRoutes";
import authRouter from "./authenicationRoutes";
import adminRouter from "./adminRoutes";



const router = express.Router();

router.get("/", indexController);
router.use("/product", productRoutes);
router.use("/auth",authRouter);
router.use("/admin",adminRouter);

export default router;
