import mongoose from "mongoose";
import { Order } from "./order.model";
import { Product } from "../product/product.model";
import AppError from "../../errors/AppError";
import { IOrderProduct } from "./order.interface";
import { User } from "../user/user.model";
import { stripe } from "../payment/stripe.config";
import { OrderStatus } from "./order.constant";



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
      success_url: "../../views/success.ejs",
      cancel_url: "http://localhost:3000/cancel",
    });

    return {
      orderId: order[0],
      checkoutUrl: checkoutSession.url,
    };
  } catch (error) {
    // await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const getAllOrdersFromDB = async (userData: any) => {
  if (userData.role === "user") {
    const orders = await Order.find({ user: userData.id })
      .populate("user", "name email")
      .populate("products.product", "name price");
    return orders;
  }
  const orders = await Order.find()
    .populate("user", "name email")
    .populate("products.product", "name price");
  return orders;
}