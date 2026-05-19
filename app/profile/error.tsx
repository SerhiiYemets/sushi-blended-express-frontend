"use client";

import css from "@/app/error.module.css";

type Props = {
    error: Error;
    reset: () => void;
};

export default function Error({ error, reset }: Props) {
    return (
        <div className={css.container}>
            <h2 className={css.title}>Něco se pokazilo...</h2>

            <p className={css.message}>
                {error.message || "Nepodařilo se načíst profil"}
            </p>

            <button className={css.button} onClick={() => reset()}>
                Zkusit znovu
            </button>
        </div>
    );
}
