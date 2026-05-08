'use client';

import { useEffect, useMemo, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useForm, type SubmitErrorHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import axios from 'axios';
import type { z } from 'zod';

import { useCartStore } from '@/lib/store/cartStore';
import { createOrder } from '@/lib/api/ordersApi';
import { orderSchema, type OrderFormData } from '@/lib/validations/orderSchema';

type OrderFormInput = z.input<typeof orderSchema>;

import css from './checkout.module.css';

const DELIVERY_FEE = 49;
const FREE_DELIVERY_THRESHOLD = 599;

export default function CheckoutClient() {
    const router = useRouter();

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const items = useCartStore(s => s.items);
    const clearCart = useCartStore(s => s.clearCart);

    const subtotal = useMemo(
        () => items.reduce((acc, item) => acc + item.price * item.quantity, 0),
        [items]
    );

    const totalQty = useMemo(
        () => items.reduce((acc, item) => acc + item.quantity, 0),
        [items]
    );

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<OrderFormInput, undefined, OrderFormData>({
        resolver: zodResolver(orderSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            phone: '',
            email: '',
            deliveryType: 'delivery',
            address: '',
            peopleCount: 1,
            notes: '',
            paymentMethod: 'cash',
        },
        mode: 'onTouched',
    });

    const deliveryType = watch('deliveryType');
    const isDelivery = deliveryType === 'delivery';

    const deliveryFee =
        !isDelivery || subtotal >= FREE_DELIVERY_THRESHOLD || subtotal === 0
            ? 0
            : DELIVERY_FEE;

    const total = subtotal + deliveryFee;

    const onSubmit = async (values: OrderFormData) => {
        console.log('[checkout] onSubmit reached', values);

        if (items.length === 0) {
            toast.error('Košík je prázdný');
            return;
        }

        if (values.deliveryType === 'delivery' && !values.address?.trim()) {
            toast.error('Zadejte prosím adresu doručení');
            return;
        }

        const payload = {
            customer: {
                firstName: values.firstName.trim(),
                lastName: values.lastName.trim(),
                phone: values.phone.trim(),
                email: values.email?.trim() || undefined,
            },
            deliveryType: values.deliveryType,
            address:
                values.deliveryType === 'delivery'
                    ? values.address?.trim()
                    : undefined,
            peopleCount: Number(values.peopleCount),
            notes: values.notes?.trim() || undefined,
            paymentMethod: values.paymentMethod,
            items: items.map(item => ({
                productId: item._id,
                name: item.name,
                quantity: item.quantity,
                price: item.price,
            })),
            subtotal,
            deliveryFee,
            totalPrice: total,
        };

        console.log(
            '[checkout] POST',
            `${process.env.NEXT_PUBLIC_API_URL}/api/orders`,
            payload
        );

        try {
            const data = await createOrder(payload);

            console.log('[checkout] order created', data);

            toast.success('Objednávka byla úspěšně odeslána');
            clearCart();
            router.push('/success');
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('[checkout] axios error', {
                    code: error.code,
                    message: error.message,
                    status: error.response?.status,
                    statusText: error.response?.statusText,
                    data: error.response?.data,
                    requestUrl: error.config?.url,
                    requestData: error.config?.data,
                });

                const serverMsg =
                    (error.response?.data as { message?: string } | undefined)
                        ?.message ?? error.message;

                const fallback = error.response
                    ? `Chyba ${error.response.status}: ${serverMsg}`
                    : `Síťová chyba: ${serverMsg}`;

                toast.error(fallback);
            } else {
                console.error('[checkout] unknown error', error);
                toast.error('Něco se pokazilo. Zkuste to prosím znovu.');
            }
        }
    };

    const onInvalid: SubmitErrorHandler<OrderFormInput> = formErrors => {
        console.warn('[checkout] validation blocked submit', formErrors);

        const firstField = Object.keys(formErrors)[0];

        toast.error(
            firstField
                ? `Zkontrolujte prosím pole: ${firstField}`
                : 'Formulář obsahuje chyby'
        );
    };

    if (!mounted) {
        return null;
    }

    if (items.length === 0) {
        return (
            <main className={css.page}>
                <section className={css.container}>
                    <div className={css.empty}>
                        <div className={css.emptyIcon}>🛒</div>

                        <h1 className={css.emptyTitle}>Košík je prázdný</h1>

                        <p className={css.emptyText}>
                            Pro dokončení objednávky přidejte produkty do
                            košíku.
                        </p>

                        <Link href="/menu" className={css.menuBtn}>
                            Otevřít menu
                        </Link>
                    </div>
                </section>
            </main>
        );
    }

    return (
        <main className={css.page}>
            <section className={css.container}>
                <header className={css.top}>
                    <h1 className={css.title}>Zadání objednávky</h1>

                    <p className={css.subtitle}>
                        Vyplňte své údaje a dokončete objednávku
                    </p>
                </header>

                <form
                    className={css.layout}
                    onSubmit={handleSubmit(onSubmit, onInvalid)}
                    noValidate
                >
                    <div className={css.formColumn}>
                        <fieldset className={css.section}>
                            <legend className={css.sectionTitle}>
                                Kontaktní údaje
                            </legend>

                            <div className={css.grid2}>
                                <div className={css.field}>
                                    <label
                                        htmlFor="firstName"
                                        className={css.label}
                                    >
                                        Jméno *
                                    </label>

                                    <input
                                        id="firstName"
                                        type="text"
                                        autoComplete="given-name"
                                        className={`${css.input} ${
                                            errors.firstName ? css.inputError : ''
                                        }`}
                                        aria-invalid={!!errors.firstName}
                                        {...register('firstName')}
                                    />

                                    {errors.firstName && (
                                        <span className={css.errorText}>
                                            Zadejte jméno
                                        </span>
                                    )}
                                </div>

                                <div className={css.field}>
                                    <label
                                        htmlFor="lastName"
                                        className={css.label}
                                    >
                                        Příjmení *
                                    </label>

                                    <input
                                        id="lastName"
                                        type="text"
                                        autoComplete="family-name"
                                        className={`${css.input} ${
                                            errors.lastName ? css.inputError : ''
                                        }`}
                                        aria-invalid={!!errors.lastName}
                                        {...register('lastName')}
                                    />

                                    {errors.lastName && (
                                        <span className={css.errorText}>
                                            Zadejte příjmení
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className={css.grid2}>
                                <div className={css.field}>
                                    <label
                                        htmlFor="phone"
                                        className={css.label}
                                    >
                                        Telefon *
                                    </label>

                                    <input
                                        id="phone"
                                        type="tel"
                                        autoComplete="tel"
                                        placeholder="+420 ..."
                                        className={`${css.input} ${
                                            errors.phone ? css.inputError : ''
                                        }`}
                                        aria-invalid={!!errors.phone}
                                        {...register('phone')}
                                    />

                                    {errors.phone && (
                                        <span className={css.errorText}>
                                            Zadejte platné telefonní číslo
                                        </span>
                                    )}
                                </div>

                                <div className={css.field}>
                                    <label
                                        htmlFor="email"
                                        className={css.label}
                                    >
                                        E-mail
                                    </label>

                                    <input
                                        id="email"
                                        type="email"
                                        autoComplete="email"
                                        placeholder="vas@email.cz"
                                        className={`${css.input} ${
                                            errors.email ? css.inputError : ''
                                        }`}
                                        aria-invalid={!!errors.email}
                                        {...register('email')}
                                    />

                                    {errors.email && (
                                        <span className={css.errorText}>
                                            Zadejte platný e-mail
                                        </span>
                                    )}
                                </div>
                            </div>
                        </fieldset>

                        <fieldset className={css.section}>
                            <legend className={css.sectionTitle}>
                                Způsob doručení
                            </legend>

                            <div
                                className={css.toggle}
                                role="radiogroup"
                                aria-label="Způsob doručení"
                            >
                                <label
                                    className={`${css.toggleOption} ${
                                        isDelivery ? css.toggleActive : ''
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        value="delivery"
                                        className={css.srOnly}
                                        {...register('deliveryType')}
                                    />

                                    <span className={css.toggleIcon}>🚚</span>

                                    <span className={css.toggleLabel}>
                                        Doručení
                                    </span>

                                    <span className={css.toggleHint}>
                                        Domů, do kanceláře
                                    </span>
                                </label>

                                <label
                                    className={`${css.toggleOption} ${
                                        !isDelivery ? css.toggleActive : ''
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        value="pickup"
                                        className={css.srOnly}
                                        {...register('deliveryType')}
                                    />

                                    <span className={css.toggleIcon}>🏠</span>

                                    <span className={css.toggleLabel}>
                                        Vyzvednutí
                                    </span>

                                    <span className={css.toggleHint}>
                                        Na provozovně
                                    </span>
                                </label>
                            </div>

                            {isDelivery && (
                                <div className={css.field}>
                                    <label
                                        htmlFor="address"
                                        className={css.label}
                                    >
                                        Adresa doručení *
                                    </label>

                                    <input
                                        id="address"
                                        type="text"
                                        autoComplete="street-address"
                                        placeholder="Ulice, č.p., město"
                                        className={`${css.input} ${
                                            errors.address ? css.inputError : ''
                                        }`}
                                        aria-invalid={!!errors.address}
                                        {...register('address')}
                                    />

                                    {errors.address && (
                                        <span className={css.errorText}>
                                            Zadejte adresu doručení
                                        </span>
                                    )}
                                </div>
                            )}
                        </fieldset>

                        <fieldset className={css.section}>
                            <legend className={css.sectionTitle}>
                                Detaily objednávky
                            </legend>

                            <div className={css.field}>
                                <label
                                    htmlFor="peopleCount"
                                    className={css.label}
                                >
                                    Počet osob *
                                </label>

                                <input
                                    id="peopleCount"
                                    type="number"
                                    min={1}
                                    max={50}
                                    className={`${css.input} ${
                                        errors.peopleCount ? css.inputError : ''
                                    }`}
                                    aria-invalid={!!errors.peopleCount}
                                    {...register('peopleCount')}
                                />

                                {errors.peopleCount && (
                                    <span className={css.errorText}>
                                        Zadejte počet osob
                                    </span>
                                )}
                            </div>

                            <div className={css.field}>
                                <label
                                    htmlFor="notes"
                                    className={css.label}
                                >
                                    Poznámka k objednávce
                                </label>

                                <textarea
                                    id="notes"
                                    rows={4}
                                    placeholder="Alergie, preference, instrukce pro doručení..."
                                    className={css.textarea}
                                    {...register('notes')}
                                />
                            </div>
                        </fieldset>

                        <fieldset className={css.section}>
                            <legend className={css.sectionTitle}>
                                Způsob platby
                            </legend>

                            <div
                                className={css.payment}
                                role="radiogroup"
                                aria-label="Způsob platby"
                            >
                                <label className={css.paymentOption}>
                                    <input
                                        type="radio"
                                        value="cash"
                                        className={css.paymentRadio}
                                        {...register('paymentMethod')}
                                    />

                                    <span className={css.paymentBox}>
                                        <span className={css.paymentIcon}>💵</span>

                                        <span className={css.paymentInfo}>
                                            <span className={css.paymentTitle}>
                                                Hotově
                                            </span>

                                            <span className={css.paymentHint}>
                                                Při převzetí
                                            </span>
                                        </span>
                                    </span>
                                </label>

                                <label className={css.paymentOption}>
                                    <input
                                        type="radio"
                                        value="card"
                                        className={css.paymentRadio}
                                        {...register('paymentMethod')}
                                    />

                                    <span className={css.paymentBox}>
                                        <span className={css.paymentIcon}>💳</span>

                                        <span className={css.paymentInfo}>
                                            <span className={css.paymentTitle}>
                                                Kartou
                                            </span>

                                            <span className={css.paymentHint}>
                                                Při převzetí
                                            </span>
                                        </span>
                                    </span>
                                </label>
                            </div>
                        </fieldset>
                    </div>

                    <aside
                        className={css.summary}
                        aria-label="Shrnutí objednávky"
                    >
                        <h2 className={css.summaryTitle}>
                            Vaše objednávka
                        </h2>

                        <p className={css.summaryMeta}>
                            {totalQty} produktů v košíku
                        </p>

                        <ul className={css.products}>
                            {items.map(item => (
                                <li key={item._id} className={css.product}>
                                    <div className={css.productImage}>
                                        {item.image ? (
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                sizes="56px"
                                                className={css.productImg}
                                            />
                                        ) : (
                                            <div className={css.productPlaceholder} />
                                        )}

                                        <span className={css.productBadge}>
                                            {item.quantity}
                                        </span>
                                    </div>

                                    <div className={css.productInfo}>
                                        <span className={css.productName}>
                                            {item.name}
                                        </span>

                                        <span className={css.productMeta}>
                                            {item.quantity} × {item.price} Kč
                                        </span>
                                    </div>

                                    <span className={css.productTotal}>
                                        {item.price * item.quantity} Kč
                                    </span>
                                </li>
                            ))}
                        </ul>

                        <div className={css.summaryRows}>
                            <div className={css.row}>
                                <span>Mezisoučet</span>

                                <span>{subtotal} Kč</span>
                            </div>

                            <div className={css.row}>
                                <span>
                                    {isDelivery ? 'Doprava' : 'Vyzvednutí'}
                                </span>

                                <span>
                                    {deliveryFee === 0 ? (
                                        <span className={css.free}>
                                            Zdarma
                                        </span>
                                    ) : (
                                        `${deliveryFee} Kč`
                                    )}
                                </span>
                            </div>
                        </div>

                        <div className={css.totalRow}>
                            <span>Celkem</span>

                            <strong>{total} Kč</strong>
                        </div>

                        <button
                            type="submit"
                            className={css.submitBtn}
                            disabled={isSubmitting}
                            aria-busy={isSubmitting}
                        >
                            {isSubmitting
                                ? 'Odesílání...'
                                : 'Dokončit objednávku'}
                        </button>

                        <Link href="/cart" className={css.backLink}>
                            Zpět do košíku
                        </Link>
                    </aside>
                </form>
            </section>
        </main>
    );
}
