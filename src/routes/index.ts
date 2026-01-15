import express from "express";
import { userRoutes } from "../modules/user/user.routes";
import { productRoutes } from "../modules/product/product.route";


const router = express.Router();

router.use("/user", userRoutes);
router.use("/product", productRoutes);


export default router;
