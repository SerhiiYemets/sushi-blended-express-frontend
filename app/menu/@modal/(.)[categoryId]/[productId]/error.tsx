"use client";

import css from "./state.module.css";

type Props = {
    error: Error;
    reset: () => void;
};

export default function Error({ error, reset }: Props) {
    return (
        <div className={css.wrapper}>
            <h2 className={css.title}>Něco se pokazilo</h2>
            <p className={css.message}>
                {error.message || "Produkt se nepodařilo načíst."}
            </p>
            <button
                type="button"
                onClick={() => reset()}
                className={css.button}
            >
                Zkusit znovu
            </button>
        </div>
    );
}
