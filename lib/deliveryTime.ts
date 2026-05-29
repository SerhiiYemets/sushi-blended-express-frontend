export const BUSINESS_OPEN_MINUTES = 10 * 60; 
export const BUSINESS_CLOSE_MINUTES = 22 * 60; 
export const SLOT_STEP_MINUTES = 30;

export const ORDER_LEAD_MINUTES = 30;

export const ASAP_VALUE = 'asap';

export type DeliveryTimeMode = 'asap' | 'scheduled';

export type TimeSlot = {
    value: string;
    label: string;
};

const HHMM_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

export function isValidSlotFormat(value: string): boolean {
    return HHMM_REGEX.test(value);
}

function minutesNow(now: Date): number {
    return now.getHours() * 60 + now.getMinutes();
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
