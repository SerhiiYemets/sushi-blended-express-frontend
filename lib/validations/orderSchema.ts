import { z } from 'zod';
import { isValidDateFormat, isValidSlotFormat } from '@/lib/deliveryTime';

const nameRegex =
    /^[A-Za-zÀ-ÿĀ-žА-яЁёЇїІіЄєҐґČčŘřŠšŽžÝýÁáÍíÉéÚúŮůŤťĎďŇň\s-]+$/;

const PHONE_FORMAT = /^\+\d{12}$/;

export function isValidPhone(raw: string): boolean {
    return PHONE_FORMAT.test(raw.trim());
}

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
            .refine(isValidPhone, 'Zadejte telefon ve formátu +420123456789'),

        email: z
            .string()
            .trim()
            .min(1, 'Zadejte e-mail')
            .pipe(z.email('Neplatný email')),

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

        deliveryMode: z.enum([
            'asap',
            'scheduled',
        ]),

        deliveryDate:
            z.string().optional(),

        deliveryTime:
            z.string().optional(),
    })
    .superRefine((data, ctx) => {
        if (data.deliveryType === 'delivery') {
            if (!data.address || data.address.trim().length < 3) {
                ctx.addIssue({
                    code: 'custom',
                    path: ['address'],
                    message: 'Zadejte adresu doručení',
                });
            }
        }

        if (data.deliveryMode !== 'scheduled') return;

        if (!data.deliveryDate || !isValidDateFormat(data.deliveryDate)) {
            ctx.addIssue({
                code: 'custom',
                path: ['deliveryDate'],
                message: 'Vyberte prosím datum doručení',
            });
        }

        if (!data.deliveryTime || !isValidSlotFormat(data.deliveryTime)) {
            ctx.addIssue({
                code: 'custom',
                path: ['deliveryTime'],
                message: 'Vyberte prosím čas doručení',
            });
        }
    });

export type OrderFormData =
    z.infer<typeof orderSchema>;

