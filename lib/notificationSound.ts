/**
 * Single, shared notification-sound instance for new online orders.
 *
 * One `Audio` object is reused for the whole app session (never re-created per
 * order), preloaded up front so the first chime has no fetch delay, and played
 * at full volume so it carries across a busy restaurant.
 *
 * Drop the audio asset at `public/sounds/notification.mp3` — files in `public/`
 * are served from the site root, hence the `/sounds/notification.mp3` path.
 *
 * NOTE on autoplay: browsers reject `play()` that is not tied to a user gesture
 * with a `NotAllowedError`. New orders arrive over Socket.IO (no gesture), so we
 * "unlock" the shared instance on the first user interaction — see
 * {@link armNotificationSoundUnlock}.
 */
const NOTIFICATION_SOUND_SRC = "/sounds/notification.mp3";

const isDev = process.env.NODE_ENV !== "production";

let audio: HTMLAudioElement | null = null;
let unlocked = false;
let unlockArmed = false;

/**
 * Lazily build the singleton on the client. Guarded for SSR, where `Audio` is
 * undefined. Sets max volume and kicks off preloading immediately.
 */
function getNotificationAudio(): HTMLAudioElement | null {
    if (typeof window === "undefined" || typeof Audio === "undefined") {
        return null;
    }

    if (!audio) {
        if (isDev) console.log("[sound] Loading sound…", NOTIFICATION_SOUND_SRC);
        audio = new Audio(NOTIFICATION_SOUND_SRC);
        audio.preload = "auto";
        audio.volume = 1.0;
        // Begin fetching/buffering now so the first notification is instant.
        audio.load();
        if (isDev) console.log("[sound] readyState:", audio.readyState);
    }

    return audio;
}

/**
 * Warm up the audio so it is fully buffered before the first order arrives.
 * Safe to call multiple times — it only ever creates one instance.
 */
export function preloadNotificationSound(): void {
    getNotificationAudio();
}

/**
 * Bless the shared instance for later programmatic playback by playing it once
 * inside the user-gesture call stack (muted, then immediately paused/reset so
 * nothing audible happens). After this, socket-triggered `play()` is allowed.
 */
function unlock(): Promise<boolean> {
    const instance = getNotificationAudio();
    if (!instance) return Promise.resolve(false);
    if (unlocked) return Promise.resolve(true);

    const previousMuted = instance.muted;
    instance.muted = true;

    return instance
        .play()
        .then(() => {
            instance.pause();
            instance.currentTime = 0;
            instance.muted = previousMuted;
            unlocked = true;
            if (isDev) console.log("[sound] audio unlocked");
            return true;
        })
        .catch(() => {
            // Still gated; we'll try again on the next interaction.
            instance.muted = previousMuted;
            return false;
        });
}

/**
 * Register one-time listeners that unlock the notification sound on the user's
 * first interaction (click / key / touch), satisfying browser autoplay policy.
 *
 * Returns a cleanup function that removes the listeners — call it from a React
 * effect's cleanup to avoid leaks.
 */
export function armNotificationSoundUnlock(): () => void {
    if (typeof window === "undefined" || unlocked || unlockArmed) {
        return () => {};
    }

    unlockArmed = true;
    const events: Array<keyof WindowEventMap> = [
        "pointerdown",
        "keydown",
        "touchstart",
    ];

    const handler = () => {
        // Remove the listeners only once unlock actually succeeds, so a rare
        // failed first attempt is retried on the next interaction.
        void unlock().then((ok) => {
            if (ok) cleanup();
        });
    };

    const cleanup = () => {
        events.forEach((event) => window.removeEventListener(event, handler));
        unlockArmed = false;
    };

    events.forEach((event) =>
        window.addEventListener(event, handler, { passive: true })
    );

    return cleanup;
}

/**
 * Play the notification chime. Restarts from the beginning on every call, so
 * rapidly arriving orders re-trigger the same sound instead of stacking
 * overlapping playbacks.
 */
export function playNotificationSound(): void {
    const instance = getNotificationAudio();
    if (!instance) return;

    instance.volume = 1.0;
    instance.currentTime = 0;
    instance.play().catch((error: unknown) => {
        // Most commonly a NotAllowedError when the user hasn't interacted yet.
        // Surface it in dev so a blocked sound is never invisible again.
        if (isDev) {
            console.warn(
                "[sound] play() was blocked — likely autoplay policy " +
                    "(no user interaction yet).",
                error
            );
        }
    });
}
