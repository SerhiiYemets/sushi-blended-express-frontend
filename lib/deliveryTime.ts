import {
    RESTAURANT_CLOSE_MINUTES,
    type RestaurantId,
} from "@/lib/restaurants";

export const BUSINESS_OPEN_MINUTES = 10 * 60; 
export const DEFAULT_BUSINESS_CLOSE_MINUTES = 22 * 60;
export const SLOT_STEP_MINUTES = 30;

// Minimum lead time for a scheduled order: the first selectable slot must be at
// least this many minutes after "now". Guarantees Poster always receives a
// delivery_time safely in the future (avoids api.errorMessage.dateNotInTheFuture).
export const ORDER_LEAD_MINUTES = 60;

export const ASAP_VALUE = 'asap';

export type DeliveryMode = 'asap' | 'scheduled';

export type TimeSlot = {
    value: string;
    label: string;
};

const HHMM_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

function getCloseMinutes(restaurantId?: RestaurantId): number {
    return restaurantId
        ? RESTAURANT_CLOSE_MINUTES[restaurantId]
        : DEFAULT_BUSINESS_CLOSE_MINUTES;
}

export function isValidSlotFormat(value: string): boolean {
    return HHMM_REGEX.test(value);
}

export function isValidDateFormat(value: string): boolean {
    return DATE_REGEX.test(value);
}

function minutesNow(now: Date): number {
    return now.getHours() * 60 + now.getMinutes();
}

/** Local YYYY-MM-DD (NOT UTC — avoids off-by-one day near midnight). */
export function toDateString(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

export function formatMinutes(totalMinutes: number): string {
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function isRestaurantOpen(
    now: Date = new Date(),
    restaurantId?: RestaurantId
): boolean {
    const m = minutesNow(now);
    const closeMinutes = getCloseMinutes(restaurantId);

    return m >= BUSINESS_OPEN_MINUTES && m < closeMinutes;
}

export function getAvailableSlots(
    now: Date = new Date(),
    restaurantId?: RestaurantId
): TimeSlot[] {
    const earliest = minutesNow(now) + ORDER_LEAD_MINUTES;
    const closeMinutes = getCloseMinutes(restaurantId);

    const start = Math.max(
        BUSINESS_OPEN_MINUTES,
        Math.ceil(earliest / SLOT_STEP_MINUTES) * SLOT_STEP_MINUTES
    );

    const slots: TimeSlot[] = [];

    for (let m = start; m <= closeMinutes; m += SLOT_STEP_MINUTES) {
        const label = formatMinutes(m);
        slots.push({ value: label, label });
    }

    return slots;
}

export function isSlotSelectable(
    value: string,
    now: Date = new Date(),
    restaurantId?: RestaurantId
): boolean {
    if (!isValidSlotFormat(value)) return false;

    return getAvailableSlots(now, restaurantId).some(
        slot => slot.value === value
    );
}

/** Every business-hours slot for the selected restaurant. */
export function getAllSlots(
    restaurantId?: RestaurantId
): TimeSlot[] {
    const closeMinutes = getCloseMinutes(restaurantId);
    const slots: TimeSlot[] = [];

    for (
        let m = BUSINESS_OPEN_MINUTES;
        m <= closeMinutes;
        m += SLOT_STEP_MINUTES
    ) {
        const label = formatMinutes(m);
        slots.push({ value: label, label });
    }

    return slots;
}

/** True when `dateStr` (YYYY-MM-DD) is today or later relative to `now`. */
export function isDateSelectable(
    dateStr: string,
    now: Date = new Date()
): boolean {
    return isValidDateFormat(dateStr) && dateStr >= toDateString(now);
}

/**
 * Slots available for a given date:
 * - past date  → none
 * - today      → only slots respecting the ORDER_LEAD_MINUTES lead time
 * - future day → all business-hours slots for the selected restaurant
 */
export function getSlotsForDate(
    dateStr: string,
    now: Date = new Date(),
    restaurantId?: RestaurantId
): TimeSlot[] {
    if (!isValidDateFormat(dateStr)) return [];

    const today = toDateString(now);

    if (dateStr < today) return [];

    if (dateStr > today) {
        return getAllSlots(restaurantId);
    }

    return getAvailableSlots(now, restaurantId);
}

export function isSlotSelectableOnDate(
    dateStr: string,
    time: string,
    now: Date = new Date(),
    restaurantId?: RestaurantId
): boolean {
    if (!isValidSlotFormat(time)) return false;

    return getSlotsForDate(dateStr, now, restaurantId).some(
        slot => slot.value === time
    );
}

/** First date that still has selectable slots (today if possible, else tomorrow). */
export function getDefaultDeliveryDate(
    now: Date = new Date(),
    restaurantId?: RestaurantId
): string {
    const today = toDateString(now);

    if (getSlotsForDate(today, now, restaurantId).length > 0) {
        return today;
    }

    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return toDateString(tomorrow);
}
