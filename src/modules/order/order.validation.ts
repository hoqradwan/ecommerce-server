import { z } from "zod";

export const orderProductSchema = z.object({
  product: z.string().min(1, "Product ID is required"),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
});

export const createOrderValidationSchema = z.object({
  products: z
    .array(orderProductSchema)
    .min(1, "At least one product is required"),
});

