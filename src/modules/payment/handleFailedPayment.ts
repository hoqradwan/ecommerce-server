import Stripe from "stripe";
import { User } from "../user/user.model";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { TTransactionFor } from "./paymentTransaction.constant";

export const handleFailedPayment = async (session: Stripe.Checkout.Session | any) => {
  try {

    const { referenceId, referenceFor, user} = session.metadata;
    
    let _user:IUser = JSON.parse(user);

    const thisCustomer = await User.findOne({ _id: _user.userId });

    if (!thisCustomer) {
          throw new AppError(httpStatus.NOT_FOUND, 'Customer not found');
    }

     let updatedObjectOfReferenceFor: any;
      if (referenceFor === TTransactionFor.Order) {
            // updatedObjectOfReferenceFor = updateOrderInformation(referenceId, newPayment._id);
      } 
   
      if (!updatedObjectOfReferenceFor) {
            throw new AppError(httpStatus.NOT_FOUND, `In handlePaymentSucceeded Webhook Handler.. order not found 🚫 For '${referenceFor}': Id : ${referenceId}`);
      }
    
  } catch (error) {
    console.error('Error handling failed payment:', error);
  }
}