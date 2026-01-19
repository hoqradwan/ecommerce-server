import express from 'express';
import { auth } from '../../middlewares/auth';
import {  createPaymentIntentController } from '../payment/payment.controller';
import { stripeWebhook } from '../payment/stripe.webhook';
import { createOrder } from './order.controller';
const router = express.Router();

// router.post("/", validateRequest(createOrderValidationSchema), auth("user"), createOrder);
router.post("/", auth("user"), createOrder);
router.post("/webhook/stripe", express.raw({ type: "application/json" }), stripeWebhook);

export const orderRoutes = router;