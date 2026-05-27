'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import {
    useForm,
    useWatch,
    type SubmitErrorHandler,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import axios from 'axios';
import type { z } from 'zod';

import {
    useCartStore,
    useCartRestaurantId,
} from '@/lib/store/cartStore';
import { useAuthStore } from '@/lib/store/authStore';
import { useSelectedRestaurant } from '@/lib/store/restaurantStore';
import { RESTAURANT_LABELS } from '@/lib/restaurants';
import { useHydrated } from '@/hooks/useHydrated';
import { createOrder } from '@/lib/api/ordersApi';
import { orderSchema, type OrderFormData } from '@/lib/validations/orderSchema';
import type { OrderPayload } from '@/types/order';
import type { User } from '@/types/user';

type OrderFormInput = z.input<typeof orderSchema>;

const selectUser = (s: ReturnType<typeof useAuthStore.getState>) => s.user;
const selectAuthHydrated = (s: ReturnType<typeof useAuthStore.getState>) =>
    s.isHydrated;

function buildDefaultsFromUser(user: User | null): OrderFormInput {
    return {
        firstName: user?.name ?? '',
        lastName: user?.lastName ?? '',
        phone: user?.phone ?? '',
        email: user?.email ?? '',
        deliveryType: user?.defaultDeliveryType ?? 'delivery',
        address: user?.address
            ? [user.address, user.apartment].filter(Boolean).join(', ')
            : '',
        peopleCount:
            typeof user?.peopleCount === 'number' && user.peopleCount > 0
                ? user.peopleCount
                : 1,
        notes: user?.deliveryNotes ?? '',
        paymentMethod: user?.preferredPaymentMethod ?? 'cash',
    };
}

import css from './checkout.module.css';

const selectItems = (s: ReturnType<typeof useCartStore.getState>) => s.items;
const selectClearCart = (s: ReturnType<typeof useCartStore.getState>) =>
    s.clearCart;

export default function CheckoutClient() {
    const router = useRouter();
    const hydrated = useHydrated();

    const items = useCartStore(selectItems);
    const clearCart = useCartStore(selectClearCart);

    const cartRestaurantId = useCartRestaurantId();
    const selectedRestaurant = useSelectedRestaurant();

    const orderRestaurantId = cartRestaurantId ?? selectedRestaurant;

    const authUser = useAuthStore(selectUser);
    const authHydrated = useAuthStore(selectAuthHydrated);

    let estimatedSubtotal = 0;
    let totalQty = 0;
    for (const item of items) {
        estimatedSubtotal += item.price * item.quantity;
        totalQty += item.quantity;
    }

    const {
        register,
        handleSubmit,
        control,
        reset,
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

    const prefilledRef = useRef(false);

    useEffect(() => {
        if (prefilledRef.current) return;
        if (!authHydrated) return;

        if (authUser) {
            reset(buildDefaultsFromUser(authUser));
        }

        prefilledRef.current = true;
    }, [authHydrated, authUser, reset]);

    const deliveryType = useWatch({
        control,
        name: 'deliveryType',
    });

    const isDelivery = deliveryType === 'delivery';

    const onSubmit = async (values: OrderFormData) => {
        if (items.length === 0) {
            toast.error('Košík je prázdný');
            return;
        }

        if (values.deliveryType === 'delivery' && !values.address?.trim()) {
            toast.error('Zadejte prosím adresu doručení');
            return;
        }

        const payload: OrderPayload = {
            restaurantId: orderRestaurantId,

            customer: {
                firstName: values.firstName.trim(),
                lastName: values.lastName.trim(),
                phone: values.phone.trim(),
                email: values.email?.trim() || undefined,

                address:
                    values.deliveryType === 'delivery'
                        ? values.address?.trim()
                        : undefined,

                deliveryNotes: values.notes?.trim() || undefined,
                peopleCount: Number(values.peopleCount),
            },

            deliveryType: values.deliveryType,
            paymentMethod: values.paymentMethod,

            items: items.map((item) => ({
                productId: String(item.posterProductId),
                quantity: item.quantity,
            })),
        };

        try {
            await createOrder(payload);

            toast.success('Objednávka byla úspěšně odeslána');
            clearCart();
            router.push('/success');
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const serverMsg =
                    (error.response?.data as { message?: string } | undefined)
                        ?.message ?? error.message;

                const fallback = error.response
                    ? `Chyba ${error.response.status}: ${serverMsg}`
                    : `Síťová chyba: ${serverMsg}`;

                toast.error(fallback);
            } else {
                toast.error('Něco se pokazilo. Zkuste to prosím znovu.');
            }
        }
    };

    const onInvalid: SubmitErrorHandler<OrderFormInput> = formErrors => {
        const firstField = Object.keys(formErrors)[0];

        toast.error(
            firstField
                ? `Zkontrolujte prosím pole: ${firstField}`
                : 'Formulář obsahuje chyby'
        );
    };

    if (hydrated && items.length === 0) {
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

                    {hydrated && (
                        <p className={css.subtitle}>
                            Restaurace:{' '}
                            <strong>
                                {RESTAURANT_LABELS[orderRestaurantId]}
                            </strong>
                        </p>
                    )}
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
                                        maxLength={10}
                                        inputMode="text"
                                        className={`${css.input} ${
                                            errors.firstName
                                                ? css.inputError
                                                : ''
                                        }`}
                                        aria-invalid={
                                            !!errors.firstName
                                        }
                                        {...register('firstName')}
                                    />

                                    {errors.firstName && (
                                        <span className={css.errorText}>
                                            {
                                                errors.firstName
                                                    .message
                                            }
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
                                        maxLength={15}
                                        inputMode="text"
                                        className={`${css.input} ${
                                            errors.lastName
                                                ? css.inputError
                                                : ''
                                        }`}
                                        aria-invalid={
                                            !!errors.lastName
                                        }
                                        {...register('lastName')}
                                    />

                                    {errors.lastName && (
                                        <span className={css.errorText}>
                                            {
                                                errors.lastName
                                                    .message
                                            }
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
                                        placeholder="+420123456789"
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
                                <span>Mezisoučet (odhad)</span>

                                <span>{estimatedSubtotal} Kč</span>
                            </div>
                        </div>

                        <p className={css.subtitle}>
                            Doprava po Kolíně a Jihlavě zdarma.
                        </p>
                        <p className={css.subtitle}>
                            Mimo město 10 Kč za každý kilometr.
                        </p>

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
