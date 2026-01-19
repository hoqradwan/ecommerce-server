import { Request, Response } from "express";
import Stripe from "stripe";
import { stripe } from "./stripe.config";



export const stripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"]!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err}`);
  }

  if (event.type === "payment_intent.succeeded") {
    const pi = event.data.object as Stripe.PaymentIntent;

    const userId = pi.metadata.userId;
    const products = JSON.parse(pi.metadata.products);

    // await createOrder({ userId, products, paymentIntentId: pi.id });
  }

  res.json({ received: true });
};
