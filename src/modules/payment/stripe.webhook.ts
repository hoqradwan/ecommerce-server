//@ts-ignore
import { Request, Response } from 'express';
//@ts-ignore
import { StatusCodes } from 'http-status-codes';
//@ts-ignore
import Stripe from 'stripe';
import { config } from '../../../config';
import stripe from '../../../config/stripe.config';
import { handlePaymentSucceeded } from './handlePaymentSucceeded';
import { handleFailedPayment } from './handleFailedPayment';
import { handleSubscriptionCancellation } from './handleSubscriptionCancellation';
import { handleSuccessfulPayment } from './handleSuccessfulPayment';
import { handleSubscriptionDates } from './handleSubscriptionDates';
import { handleTrialWillEnd } from './handleTrialWillEnd';

const webhookHandler = async (req: Request, res: Response): Promise<void> => {
     console.log('Webhook received');
     const sig = req.headers['stripe-signature'];
     const webhookSecret = config.stripe.webhookSecret;

     if (!webhookSecret) {
          console.error('Stripe webhook secret not set');
          res.status(500).send('Webhook secret not configured');
          return;
     }

     let event: Stripe.Event;

     try {
          event = stripe.webhooks.constructEvent(req.body, sig as string, webhookSecret);
     } catch (err: any) {
          console.error('Webhook signature verification failed:', err.message);
          res.status(400).send(`Webhook Error: ${err.message}`);
          return;
     }

     console.log('event.type', event.type);
     try {
          switch (event.type) {
               case 'checkout.session.completed': 
                    await handlePaymentSucceeded(event.data.object);
                    break;
               case 'payment_intent.payment_failed':
               case 'checkout.session.expired':
                    // Happens when the checkout session expires (user didn’t complete the payment).
                    console.log("🪝checkout.session.expired")
                    await handleFailedPayment(event.data.object);
                    break;
              
               default:
                    console.log("🪝🪝unhandled🪝🪝", event.type)
                    break;
          }

          // Responding after handling the event
          res.status(200).json({ received: true });
     } catch (err: any) {
          console.error('❌❌Error handling the event:', err);
          res.status(500).send(`❌❌Internal Server Error: ${err.message}`);
     }
};

export default webhookHandler;
// import { Request, Response } from "express";
// import Stripe from "stripe";
// import { stripe } from "./stripe.config";



// export const stripeWebhook = async (req: Request, res: Response) => {
//   const sig = req.headers["stripe-signature"]!;

//   let event: Stripe.Event;

//   try {
//     event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
//   } catch (err) {
//     return res.status(400).send(`Webhook Error: ${err}`);
//   }

//   if (event.type === "payment_intent.succeeded") {
//     const pi = event.data.object as Stripe.PaymentIntent;

//     const userId = pi.metadata.userId;
//     const products = JSON.parse(pi.metadata.products);

//     // await createOrder({ userId, products, paymentIntentId: pi.id });
//   }

//   res.json({ received: true });
// };
