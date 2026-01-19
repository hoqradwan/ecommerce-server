import express from "express";
import { userRoutes } from "../modules/user/user.routes";
import { productRoutes } from "../modules/product/product.route";
import { orderRoutes } from "../modules/order/order.route";


const router = express.Router();

router.use("/user", userRoutes);
router.use("/product", productRoutes);
router.use("/order", orderRoutes);


export default router;
