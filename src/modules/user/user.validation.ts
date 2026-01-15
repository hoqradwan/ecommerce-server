import { z } from "zod";

export const userRegistrationValidationSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z
        .string()
        .min(6, "Password must be at least 6 characters"),
    name: z.string(),
    role: z.string().optional(),
});

