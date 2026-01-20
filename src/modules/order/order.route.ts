import express from 'express';
import { auth } from '../../middlewares/auth';

import { createOrder } from './order.controller';
const router = express.Router();

router.post("/", auth("user"), createOrder);


export const orderRoutes = router;