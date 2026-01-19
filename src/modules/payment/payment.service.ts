// import Stripe from "stripe";
// import { Product } from "../product/product.model";
// import AppError from "../../errors/AppError";
// import { IOrderProduct } from "../order/order.interface";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2025-02-24.acacia" });

// export const createPaymentIntent = async (products: IOrderProduct[], userId: string) => {
//     if (!Array.isArray(products) || products.length === 0) {
//         throw new AppError(400, "Products must be a non-empty array");
//     }

//     let totalAmount = 0;

//     for (const item of products) {
//         const product = await Product.findById(item.product);
//         if (!product) throw new AppError(404, `Product with ID ${item.product} not found`);
//         totalAmount += product.price * item.quantity;
//     }

//     const paymentIntent = await stripe.paymentIntents.create({
//         amount: Math.round(totalAmount * 100), // Stripe expects cents
//         currency: "usd",
//         metadata: {
//             userId,
//             products: JSON.stringify(products),
//         },
//         payment_method_types: ["card"],
//     });

//     return paymentIntent.client_secret;
// };
