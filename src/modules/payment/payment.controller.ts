// import {  Response, NextFunction } from "express";
// import AppError from "../../errors/AppError";
// import { CustomRequest } from "../../utils/customRequest";
// import { createPaymentIntent } from "./payment.service";

// export const createPaymentIntentController = async (req: CustomRequest, res: Response, next: NextFunction) => {
//   try {
//     const {id : userId} = req.user
//     const { products } = req.body 

//     if (!products || !Array.isArray(products) || products.length === 0)
//       throw new AppError(400, "Products must be a non-empty array");

//     const clientSecret = await createPaymentIntent(products, userId);

//     res.status(200).json({ clientSecret });
//   } catch (err) {
//     next(err);
//   }
// };



// // import Stripe from "stripe";
// // import { Product } from "../product/product.model";
// // import AppError from "../../errors/AppError";
// // import { IOrderProduct } from "../order/order.interface";
// // import { Request, Response, NextFunction } from "express";

// // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// // export const createPaymentIntent = async (
// //   req: Request,
// //   res: Response,
// //   next: NextFunction
// // ) => {
// //   try {
// //     const { products } = req.body as { products: IOrderProduct[] };

// //     if (!products || !Array.isArray(products) || products.length === 0) {
// //       throw new AppError(400, "Products must be a non-empty array");
// //     }

// //     let totalAmount = 0;

// //     for (const item of products) {
// //       const product = await Product.findById(item.product);
// //       if (!product) {
// //         throw new AppError(404, `Product with ID ${item.product} not found`);
// //       }
// //       totalAmount += product.price * item.quantity;
// //     }

// //     const paymentIntent = await stripe.paymentIntents.create({
// //       amount: Math.round(totalAmount * 100), // Stripe expects cents
// //       currency: "usd",
// //       metadata: {
// //         products: JSON.stringify(products),
// //       },
// //     });

// //     res.status(200).json({ clientSecret: paymentIntent.client_secret });
// //   } catch (err) {
// //     next(err);
// //   }
// // };
