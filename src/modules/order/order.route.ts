import express from 'express';
import { auth } from '../../middlewares/auth';

import { createOrder, getAllOrders } from './order.controller';
const router = express.Router();

router.post("/", auth("user"), createOrder);
router.get("/", auth("user","admin"), getAllOrders);


export const orderRoutes = router;