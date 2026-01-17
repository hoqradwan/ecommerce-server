import express from 'express';
const router = express.Router();

router.post("/", createOrder);
export const orderRoutes = router;