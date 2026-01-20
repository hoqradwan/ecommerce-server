import { Schema, Types } from "mongoose";
import { TCurrency } from "../../enums/payment";
import { TPaymentStatus, TTransactionFor } from "./paymentTransaction.constant";

export interface IPaymentTransaction {
    _id?: Types.ObjectId; // undefined |  Types.ObjectId |
    userId: Types.ObjectId; //🔗
    referenceFor: TTransactionFor; //🧩 
    referenceId: Types.ObjectId; //🔗
    transactionId: string; // from kappes
    paymentIntent: string; // from kappes
    amount: number;
    currency: TCurrency.usd
    paymentStatus:
    TPaymentStatus.pending |
    TPaymentStatus.pending |
    TPaymentStatus.completed |
    TPaymentStatus.failed |
    TPaymentStatus.cancelled,

    gatewayResponse: {
        type: Schema.Types.Mixed,
        default: null,
    },

}