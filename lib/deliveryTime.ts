export const BUSINESS_OPEN_MINUTES = 10 * 60; 
export const BUSINESS_CLOSE_MINUTES = 22 * 60; 
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

export function isRestaurantOpen(now: Date = new Date()): boolean {
    const m = minutesNow(now);
    return m >= BUSINESS_OPEN_MINUTES && m < BUSINESS_CLOSE_MINUTES;
}

export function getAvailableSlots(now: Date = new Date()): TimeSlot[] {
    const earliest = minutesNow(now) + ORDER_LEAD_MINUTES;

    const start = Math.max(
        BUSINESS_OPEN_MINUTES,
        Math.ceil(earliest / SLOT_STEP_MINUTES) * SLOT_STEP_MINUTES
    );

    const slots: TimeSlot[] = [];
    for (let m = start; m <= BUSINESS_CLOSE_MINUTES; m += SLOT_STEP_MINUTES) {
        const label = formatMinutes(m);
        slots.push({ value: label, label });
    }
    return slots;
}

export function isSlotSelectable(
    value: string,
    now: Date = new Date()
): boolean {
    if (!isValidSlotFormat(value)) return false;
    return getAvailableSlots(now).some(slot => slot.value === value);
}

/** Every business-hours slot (10:00–22:00, 30-min step), date-independent. */
export function getAllSlots(): TimeSlot[] {
    const slots: TimeSlot[] = [];
    for (
        let m = BUSINESS_OPEN_MINUTES;
        m <= BUSINESS_CLOSE_MINUTES;
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
 * - today      → only slots respecting the {@link ORDER_LEAD_MINUTES} lead time
 * - future day → all business-hours slots
 */
export function getSlotsForDate(
    dateStr: string,
    now: Date = new Date()
): TimeSlot[] {
    if (!isValidDateFormat(dateStr)) return [];

    const today = toDateString(now);
    if (dateStr < today) return [];

    if (dateStr > today) return getAllSlots();

    // Today: enforce the minimum lead time so the user can never pick a slot
    // that is too close to now. Reuses the single lead-time-aware generator so
    // the dropdown and the submit-time guard (isSlotSelectableOnDate) agree.
    return getAvailableSlots(now);
}

export function isSlotSelectableOnDate(
    dateStr: string,
    time: string,
    now: Date = new Date()
): boolean {
    if (!isValidSlotFormat(time)) return false;
    return getSlotsForDate(dateStr, now).some(slot => slot.value === time);
}

/** First date that still has selectable slots (today if possible, else tomorrow). */
export function getDefaultDeliveryDate(now: Date = new Date()): string {
    const today = toDateString(now);
    if (getSlotsForDate(today, now).length > 0) return today;

    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return toDateString(tomorrow);
}
