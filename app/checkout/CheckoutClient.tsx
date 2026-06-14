'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import {
    useForm,
    useWatch,
    type SubmitErrorHandler,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
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
import { useNow } from '@/hooks/useNow';
import { createOrder } from '@/lib/api/ordersApi';
import {
    getDefaultDeliveryDate,
    getSlotsForDate,
    isDateSelectable,
    isRestaurantOpen,
    isSlotSelectableOnDate,
    toDateString,
} from '@/lib/deliveryTime';
import { orderSchema, type OrderFormData } from '@/lib/validations/orderSchema';
import { calculateDelivery } from '@/lib/api/deliveryApi';
import type { OrderPayload } from '@/types/order';
import type { SelectedLocation } from '@/types/delivery';
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
        deliveryMode: 'asap',
        deliveryDate: '',
        deliveryTime: '',
    };
}

import css from './checkout.module.css';

// Leaflet only runs in the browser. Lazy-load it with SSR disabled so the map
// bundle is fetched on demand and never participates in server rendering /
// hydration. It is rendered only when the delivery flow is active.
const DeliveryMap = dynamic(
    () => import('@/components/DeliveryMap/DeliveryMap'),
    {
        ssr: false,
        loading: () => <div className={css.mapLoading}>Načítání mapy…</div>,
    }
);

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
        setValue,
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
            deliveryMode: 'asap',
            deliveryDate: '',
            deliveryTime: '',
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

    // ---- Map-based delivery location + backend-calculated fee ----
    const [selectedLocation, setSelectedLocation] =
        useState<SelectedLocation | null>(null);

    const handleLocationSelected = (location: SelectedLocation) => {
        setSelectedLocation(location);
        // Mirror the resolved address into the form field so it is submitted
        // and validated like a normally-typed address.
        setValue('address', location.address, {
            shouldValidate: true,
            shouldDirty: true,
        });
    };

    // The backend owns the fee — we only display what it returns and never
    // submit a fee. Refetches whenever the chosen point or restaurant changes.
    const {
        data: deliveryResult,
        isFetching: calculatingFee,
        isError: feeError,
    } = useQuery({
        queryKey: [
            'delivery-fee',
            orderRestaurantId,
            selectedLocation?.lat,
            selectedLocation?.lng,
        ],
        queryFn: () =>
            calculateDelivery({
                restaurantId: orderRestaurantId,
                lat: selectedLocation!.lat,
                lng: selectedLocation!.lng,
            }),
        enabled: isDelivery && selectedLocation != null,
        staleTime: 60 * 1000,
        retry: 1,
    });

    const deliveryAvailable = deliveryResult ? deliveryResult.available : null;
    const deliveryFee = deliveryResult?.available
        ? deliveryResult.deliveryFee
        : null;
    const deliveryZoneName = deliveryResult?.available
        ? deliveryResult.zoneName
        : null;

    const outsideArea = isDelivery && deliveryAvailable === false;

    const appliedDeliveryFee =
        isDelivery && deliveryAvailable === true && deliveryFee != null
            ? deliveryFee
            : 0;

    const orderTotal = estimatedSubtotal + appliedDeliveryFee;

    // Delivery orders can only be submitted once a deliverable point is chosen.
    const deliveryReady =
        !isDelivery ||
        (selectedLocation != null &&
            deliveryAvailable === true &&
            !calculatingFee);

    const nowTs = useNow(60_000);
    const now = useMemo(() => (nowTs == null ? null : new Date(nowTs)), [nowTs]);

    const deliveryMode = useWatch({ control, name: 'deliveryMode' });
    const scheduledDate = useWatch({ control, name: 'deliveryDate' });
    const scheduledTime = useWatch({ control, name: 'deliveryTime' });

    const canAsap = now ? isRestaurantOpen(now) : false;

    const minDate = now ? toDateString(now) : '';

    const slots = useMemo(
        () => (now && scheduledDate ? getSlotsForDate(scheduledDate, now) : []),
        [now, scheduledDate]
    );

    useEffect(() => {
        if (!now) return;
        if (!canAsap && deliveryMode === 'asap') {
            setValue('deliveryMode', 'scheduled');
        }
    }, [now, canAsap, deliveryMode, setValue]);

    useEffect(() => {
        if (!now || deliveryMode !== 'scheduled') return;
        if (!scheduledDate || !isDateSelectable(scheduledDate, now)) {
            setValue('deliveryDate', getDefaultDeliveryDate(now));
        }
    }, [now, deliveryMode, scheduledDate, setValue]);

    useEffect(() => {
        if (deliveryMode !== 'scheduled') return;
        const stillValid =
            scheduledTime && slots.some(s => s.value === scheduledTime);
        if (!stillValid) {
            setValue('deliveryTime', slots[0]?.value ?? '');
        }
    }, [deliveryMode, scheduledTime, slots, setValue]);

    const onSubmit = async (values: OrderFormData) => {
        if (items.length === 0) {
            toast.error('Košík je prázdný');
            return;
        }

        if (values.deliveryType === 'delivery') {
            if (!values.address?.trim() || !selectedLocation) {
                toast.error('Vyberte prosím místo doručení na mapě');
                return;
            }

            if (calculatingFee) {
                toast.error('Počkejte prosím na ověření dostupnosti doručení');
                return;
            }

            if (deliveryAvailable !== true) {
                toast.error('Tato adresa je mimo naši oblast doručení');
                return;
            }
        }

        const submitNow = new Date();

        let deliveryMode: 'asap' | 'scheduled' = values.deliveryMode;
        let deliveryDate: string | undefined;
        let deliveryTime: string | undefined;

        if (values.deliveryMode === 'asap') {
            if (!isRestaurantOpen(submitNow)) {
                toast.error(
                    'Restaurace je momentálně zavřená. Vyberte prosím konkrétní čas doručení.'
                );
                return;
            }
            deliveryMode = 'asap';
        } else {
            const date = values.deliveryDate ?? '';
            const time = values.deliveryTime ?? '';

            if (!isDateSelectable(date, submitNow)) {
                toast.error(
                    'Vybrané datum doručení již není dostupné. Zvolte prosím jiné.'
                );
                return;
            }

            if (!isSlotSelectableOnDate(date, time, submitNow)) {
                toast.error(
                    'Vybraný čas doručení již není dostupný. Zvolte prosím jiný.'
                );
                return;
            }

            deliveryMode = 'scheduled';
            deliveryDate = date;
            deliveryTime = time;
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

            deliveryMode,
            // Only sent for scheduled orders; ASAP omits both fields.
            ...(deliveryMode === 'scheduled'
                ? { deliveryDate, deliveryTime }
                : {}),

            // Map-selected coordinates for delivery orders. The backend uses
            // these to compute the fee itself — we never send deliveryFee.
            ...(values.deliveryType === 'delivery' && selectedLocation
                ? {
                      deliveryLocation: {
                          lat: selectedLocation.lat,
                          lng: selectedLocation.lng,
                      },
                  }
                : {}),

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
                                <>
                                    <DeliveryMap
                                        restaurantId={orderRestaurantId}
                                        onLocationSelected={
                                            handleLocationSelected
                                        }
                                    />

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
                                            placeholder="Vyberte adresu výše nebo na mapě"
                                            className={`${css.input} ${
                                                errors.address
                                                    ? css.inputError
                                                    : ''
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
                                </>
                            )}
                        </fieldset>

                        <fieldset className={css.section}>
                            <legend className={css.sectionTitle}>
                                Čas doručení
                            </legend>

                            {!hydrated || !now ? (
                                <p className={css.subtitle}>
                                    Načítání dostupných časů…
                                </p>
                            ) : (
                                <>
                                    <div
                                        className={css.toggle}
                                        role="radiogroup"
                                        aria-label="Čas doručení"
                                    >
                                        <label
                                            className={`${css.toggleOption} ${
                                                deliveryMode === 'asap'
                                                    ? css.toggleActive
                                                    : ''
                                            } ${
                                                !canAsap
                                                    ? css.toggleDisabled
                                                    : ''
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                value="asap"
                                                className={css.srOnly}
                                                disabled={!canAsap}
                                                {...register('deliveryMode')}
                                            />

                                            <span className={css.toggleIcon}>
                                                ⚡
                                            </span>

                                            <span className={css.toggleLabel}>
                                                Co nejdříve
                                            </span>

                                            <span className={css.toggleHint}>
                                                {canAsap
                                                    ? 'Doručíme co nejdříve'
                                                    : 'Mimo otevírací dobu'}
                                            </span>
                                        </label>

                                        <label
                                            className={`${css.toggleOption} ${
                                                deliveryMode === 'scheduled'
                                                    ? css.toggleActive
                                                    : ''
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                value="scheduled"
                                                className={css.srOnly}
                                                {...register('deliveryMode')}
                                            />

                                            <span className={css.toggleIcon}>
                                                🗓️
                                            </span>

                                            <span className={css.toggleLabel}>
                                                Naplánovat
                                            </span>

                                            <span className={css.toggleHint}>
                                                Vyberte datum a čas
                                            </span>
                                        </label>
                                    </div>

                                    {deliveryMode === 'scheduled' && (
                                        <div className={css.grid2}>
                                            <div className={css.field}>
                                                <label
                                                    htmlFor="deliveryDate"
                                                    className={css.label}
                                                >
                                                    Datum doručení *
                                                </label>

                                                <input
                                                    id="deliveryDate"
                                                    type="date"
                                                    min={minDate}
                                                    className={`${css.input} ${
                                                        errors.deliveryDate
                                                            ? css.inputError
                                                            : ''
                                                    }`}
                                                    aria-invalid={
                                                        !!errors.deliveryDate
                                                    }
                                                    {...register('deliveryDate')}
                                                />

                                                {errors.deliveryDate && (
                                                    <span
                                                        className={css.errorText}
                                                    >
                                                        {
                                                            errors.deliveryDate
                                                                .message
                                                        }
                                                    </span>
                                                )}
                                            </div>

                                            <div className={css.field}>
                                                <label
                                                    htmlFor="deliveryTime"
                                                    className={css.label}
                                                >
                                                    Čas doručení *
                                                </label>

                                                <select
                                                    id="deliveryTime"
                                                    className={`${css.input} ${
                                                        css.select
                                                    } ${
                                                        errors.deliveryTime
                                                            ? css.inputError
                                                            : ''
                                                    }`}
                                                    aria-invalid={
                                                        !!errors.deliveryTime
                                                    }
                                                    disabled={
                                                        slots.length === 0
                                                    }
                                                    {...register('deliveryTime')}
                                                >
                                                    {slots.length === 0 ? (
                                                        <option value="">
                                                            Žádné volné časy
                                                        </option>
                                                    ) : (
                                                        slots.map(slot => (
                                                            <option
                                                                key={slot.value}
                                                                value={
                                                                    slot.value
                                                                }
                                                            >
                                                                {slot.label}
                                                            </option>
                                                        ))
                                                    )}
                                                </select>

                                                {errors.deliveryTime && (
                                                    <span
                                                        className={css.errorText}
                                                    >
                                                        {
                                                            errors.deliveryTime
                                                                .message
                                                        }
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {deliveryMode === 'scheduled' &&
                                        slots.length === 0 && (
                                            <p className={css.subtitle}>
                                                Pro tento den už nejsou volné
                                                časy. Vyberte prosím jiný den.
                                            </p>
                                        )}

                                    {!canAsap && (
                                        <p className={css.subtitle}>
                                            Momentálně je zavřeno pro okamžité
                                            doručení – naplánujte prosím datum
                                            a čas.
                                        </p>
                                    )}
                                </>
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
                                <span>Produkty</span>

                                <span>{estimatedSubtotal} Kč</span>
                            </div>

                            {isDelivery && (
                                <div className={css.row}>
                                    <span>Doprava</span>

                                    <span>
                                        {calculatingFee
                                            ? 'Výpočet…'
                                            : outsideArea
                                              ? 'Mimo oblast'
                                              : deliveryAvailable === true &&
                                                  deliveryFee != null
                                                ? `${deliveryFee} Kč`
                                                : '—'}
                                    </span>
                                </div>
                            )}

                            {isDelivery &&
                                deliveryAvailable === true &&
                                deliveryZoneName && (
                                    <p className={css.zoneNote}>
                                        Zóna doručení: {deliveryZoneName}
                                    </p>
                                )}
                        </div>

                        <div className={css.totalRow}>
                            <span>Celkem</span>

                            <strong>{orderTotal} Kč</strong>
                        </div>

                        {isDelivery && feeError && (
                            <p className={css.errorText}>
                                Nepodařilo se ověřit dostupnost doručení. Zkuste
                                to prosím znovu.
                            </p>
                        )}

                        {outsideArea ? (
                            <div className={css.outsideArea} role="alert">
                                <span
                                    className={css.outsideIcon}
                                    aria-hidden="true"
                                >
                                    🚫
                                </span>

                                <p className={css.outsideText}>
                                    Tuto adresu bohužel nedoručujeme – je mimo
                                    naši oblast doručení. Zvolte prosím jinou
                                    adresu.
                                </p>
                            </div>
                        ) : (
                            <button
                                type="submit"
                                className={css.submitBtn}
                                disabled={isSubmitting || !deliveryReady}
                                aria-busy={isSubmitting}
                            >
                                {isSubmitting
                                    ? 'Odesílání...'
                                    : 'Dokončit objednávku'}
                            </button>
                        )}

                        <Link href="/cart" className={css.backLink}>
                            Zpět do košíku
                        </Link>
                    </aside>
                </form>
            </section>
        </main>
    );
}
