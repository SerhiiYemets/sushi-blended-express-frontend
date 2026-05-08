import { z } from "zod";

export const orderSchema = z.object({
    firstName: z
        .string()
        .min(2),

    lastName: z
        .string()
        .min(2),

    phone: z
        .string()
        .min(6),

    email: z
        .string()
        .email()
        .optional()
        .or(z.literal("")),

    deliveryType: z.enum([
        "delivery",
        "pickup",
    ]),

    address: z.string().optional(),

    peopleCount: z.coerce
        .number()
        .min(1),

    notes: z.string().optional(),

    paymentMethod: z.enum([
        "cash",
        "card",
    ]),
});

export type OrderFormData =
    z.infer<typeof orderSchema>;