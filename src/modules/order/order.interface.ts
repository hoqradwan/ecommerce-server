import { Types } from "mongoose";

export interface IOrderProduct {
  product: Types.ObjectId;
  quantity: number;
}

export type PaymentStatus = "pending" | "paid" | "failed" ;
export type OrderStatus = "processing" | "shipped" | "delivered" | "cancelled";

export interface IOrder {
  _id?: Types.ObjectId;
  user: Types.ObjectId;
  products: IOrderProduct[];
  totalAmount: number;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  paymentIntentId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
