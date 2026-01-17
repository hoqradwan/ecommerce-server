import { Order } from "./order.model";

export const createOrderInToDB = async (orderData: any, userId: string) => {
    const { products, totalAmount } = orderData;
    const order = await Order.create({
        user: userId,
        products,
        totalAmount,
    });
    return order;
}