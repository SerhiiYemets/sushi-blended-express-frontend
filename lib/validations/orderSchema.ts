import { z } from 'zod';

const nameRegex =
    /^[A-Za-zÀ-ÿĀ-žА-яЁёЇїІіЄєҐґČčŘřŠšŽžÝýÁáÍíÉéÚúŮůŤťĎďŇň\s-]+$/;

const phoneRegex =
    /^[0-9+\s()\-]+$/;

export const orderSchema =
    z.object({
        firstName: z
            .string()
            .trim()
            .min(2, 'Zadejte jméno - Jméno může mít maximálně 10 znaků')
            .max(
                10,
                'Jméno může mít maximálně 10 znaků'
            )
            .regex(
                nameRegex,
                'Jméno může obsahovat pouze písmena'
            ),

        lastName: z
            .string()
            .trim()
            .min(
                2,
                'Zadejte příjmení - Příjmení může mít maximálně 15 znaků'
            )
            .max(
                15,
                'Příjmení může mít maximálně 15 znaků'
            )
            .regex(
                nameRegex,
                'Příjmení může obsahovat pouze písmena'
            ),

        phone: z
            .string()
            .trim()
            .min(
                6,
                'Zadejte telefonní číslo'
            )
            .max(
                15,
                'Telefonní číslo je příliš dlouhé'
            )
            .regex(
                phoneRegex,
                'Telefon může obsahovat pouze čísla'
            ),

        email: z
            .string()
            .email(
                'Neplatný email'
            )
            .optional()
            .or(z.literal('')),

        deliveryType: z.enum([
            'delivery',
            'pickup',
        ]),

        address:
            z.string().optional(),

        peopleCount:
            z.coerce
                .number()
                .min(1),

        notes:
            z.string().optional(),

        paymentMethod: z.enum([
            'cash',
            'card',
        ]),
    });

export type OrderFormData =
    z.infer<typeof orderSchema>;

