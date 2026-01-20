import { Types } from "mongoose";
import { OrderStatus } from "./order.constant";

export interface IOrderProduct {
  product: Types.ObjectId;
  quantity: number;
}

export interface IOrder {
  _id?: Types.ObjectId;
  user: Types.ObjectId;
  products: IOrderProduct[];
  totalAmount: number;
  orderStatus: OrderStatus;
}
