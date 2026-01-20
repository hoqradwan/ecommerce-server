//@ts-ignore
import { Request, Response } from 'express';
import Stripe from 'stripe';
import { handlePaymentSucceeded } from './handlePaymentSucceeded';
import { handleFailedPayment } from './handleFailedPayment';
import { stripe } from './stripe.config';


const webhookHandler = async (req: Request, res: Response): Promise<void> => {
     console.log('Webhook received');
     const sig = req.headers['stripe-signature'];
     const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

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