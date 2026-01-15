import express from "express";
import { createProduct, getAllProducts } from "./product.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { productValidationSchema } from "./product.validation";
import { auth } from "../../middlewares/auth";
const router = express.Router();

router.post("/", validateRequest(productValidationSchema), auth("admin"), createProduct)
router.get("/", auth("admin"), getAllProducts);

export const productRoutes = router;