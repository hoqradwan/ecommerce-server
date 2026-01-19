import mongoose from "mongoose";
import { Order } from "./order.model";
import { Product } from "../product/product.model";
import AppError from "../../errors/AppError";
import { IOrderProduct } from "./order.interface";
import { User } from "../user/user.model";
import { stripe } from "../payment/stripe.config";
import { OrderStatus } from "./order.constant";


interface StripeOrderMeta {
  userId: string;
  products: { product: string; quantity: number }[];
  paymentIntentId: string;
}

export const createOrderInToDB = async (
  products: IOrderProduct[],
  user: any
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let totalAmount = 0;
    const orderProducts: IOrderProduct[] = [];

    // 1️⃣ Validate product & reduce stock
    for (const item of products) {
      const product = await Product.findOneAndUpdate(
        { _id: item.product, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } },
        { new: true, session }
      );

      if (!product) {
        throw new AppError(400, "Insufficient stock");
      }

      totalAmount += product.price * item.quantity;
      orderProducts.push({
        product: product._id,
        quantity: item.quantity,
      });
    }
    // 2️⃣ Create order (STRICTLY following schema)
    const order = await Order.create(
      [
        {
          user: user.id,
          products: orderProducts,
          totalAmount,
          orderStatus: OrderStatus.processing,
        },
      ],
      { session }
    );

    // 3️⃣ Commit DB transaction
    await session.commitTransaction();
    session.endSession();

    // 4️⃣ Stripe customer
    let stripeCustomerId = user.stripe_customer_id;

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
      });

      stripeCustomerId = customer.id;

      await User.findByIdAndUpdate(user.userId, {
        stripe_customer_id: stripeCustomerId,
      });
    }

    // 5️⃣ Stripe Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer: stripeCustomerId,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Order Payment",
            },
            unit_amount: totalAmount * 100,
          },
          quantity: 1,
        },
      ],
      metadata: {
        referenceId: order[0]._id.toString(),
        referenceFor: "Order",
        user: JSON.stringify(user),
        currency: "usd",
        amount: totalAmount.toString(),

      },
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/cancel",
    });

    return {
      orderId: order[0]._id,
      checkoutUrl: checkoutSession.url,
    };
  } catch (error) {
    // await session.abortTransaction();
    session.endSession();
    throw error;
  }
};


// import AppError from "../../errors/AppError";
// import { Product } from "../product/product.model";
// import { IOrder } from "./order.interface";
// import { Order } from "./order.model";

// import mongoose from "mongoose";

// export const createOrderInToDB = async (
//   orderData: IOrder,
//   userId: string,
// paymentIntentId: string
// ) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const { products } = orderData;
//     let totalAmount = 0;
//     const listedProducts = [];

//     for (const item of products) {
//       const product = await Product.findOneAndUpdate(
//         {
//           _id: item.product,
//           stock: { $gte: item.quantity },
//         },
//         {
//           $inc: { stock: -item.quantity },
//         },
//         {
//           new: true,
//           session,
//         }
//       );

//       if (!product) {
//         throw new AppError(
//           400,
//           `Insufficient stock for product ${item.product}`
//         );
//       }

//       totalAmount += product.price * item.quantity;

//       listedProducts.push({
//         product: product._id,
//         quantity: item.quantity,
//       });
//     }

//     const [order] = await Order.create(
//       [
//         {
//           user: userId,
//           products: listedProducts,
//           totalAmount,
//         },
//       ],
//       { session }
//     );

//     await session.commitTransaction();
//     session.endSession();

//     return order;
//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();
//     throw error;
//   }
// };


// export const getMyOrders = async (req: Request, res: Response) => {
//   const orders = await Order.find({ user: req.user.id })
//     .populate("products.product");

//   res.json(orders);
// };

// export const getOrderById = async (req: Request, res: Response) => {
//   const order = await Order.findById(req.params.id)
//     .populate("products.product");

//   if (!order) {
//     return res.status(404).json({ message: "Order not found" });
//   }

//   res.json(order);
// };