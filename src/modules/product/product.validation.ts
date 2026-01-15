import { z } from "zod";

export const productValidationSchema = z.object({
    name: z.string().min(1, "Name is required").trim(),
    description: z.string().min(1, "Description is required"),
    price: z.number().min(0, "Price cannot be a negative number"),
    stock: z.number().min(0, "Stock must be a positive number").default(0),
});

export type Product = z.infer<typeof productValidationSchema>;