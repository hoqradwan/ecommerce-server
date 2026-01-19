import Stripe from "stripe";
import { User } from "../user/user.model";
import AppError from "../../errors/AppError";
import { IUser } from "../user/user.interface";
import httpStatus from "http-status";
import { PaymentTransaction } from "./paymentTransaction.model";
import { TPaymentStatus, TTransactionFor } from "./paymentTransaction.constant";
import { IOrder } from "../order/order.interface";
import { Order } from "../order/order.model";
import { OrderStatus } from "../order/order.constant";

export const handlePaymentSucceeded = async (session: Stripe.Checkout.Session) => {
     
     try {

         const { 
               referenceId,
               user,
               referenceFor,
               currency,
               amount,
               ...rest  // 👈 This captures everything else
          }: any = session.metadata;
          // userId // for sending notification .. 

          if(!session.metadata){
               return
          }

          let _user:IUser = JSON.parse(user);

          const thisCustomer = await User.findOne({ _id: _user.id });

          if (!thisCustomer) {
               throw new AppError(httpStatus.NOT_FOUND, 'Customer not found');
          }
      
          const paymentIntent = session.payment_intent as string;
          console.log('=============================');
          console.log('paymentIntent : ', paymentIntent);
          
          const isPaymentExist = await PaymentTransaction.findOne({ paymentIntent });

          if (isPaymentExist) {
               throw new AppError(httpStatus.BAD_REQUEST, 'From Webhook handler : Payment Already exist');
          }

          
          const newPayment = await PaymentTransaction.create({
               userId: _user.id,
               transactionId: session.id,
               paymentIntent: paymentIntent,
               amount: amount,
               currency,
               paymentStatus: TPaymentStatus.completed,
               gatewayResponse: session,
          });

          let updatedObjectOfReferenceFor: any;
          if (referenceFor === TTransactionFor.Order) {
               updatedObjectOfReferenceFor = 
               updateOrderInformation(
                    referenceId, // orderId
                    newPayment._id, 
               );
          } 


          return { payment: newPayment, paymentFor: updatedObjectOfReferenceFor };
     } catch (error) {
          console.error('Error in handlePaymentSucceeded:', error);
     }
};

async function updateOrderInformation(
     orderId: string,
     paymentTransactionId: string,
){

     // isBookingExists = await Order.findOne({ _id: orderId });

     const updatedOrder:IOrder = await Order.findByIdAndUpdate(orderId, { 
          /* update fields */ 
          paymentTransactionId : paymentTransactionId,
          status : OrderStatus.confirmed
     }, { new: true });

   
     return updatedOrder;
}