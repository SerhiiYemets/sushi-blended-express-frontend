'use client';

import css from './error.module.css';

type Props = {
    error: Error;
    reset: () => void;
};

export default function Error({ error, reset }: Props) {
    return (
        <div className={css.container}>
            <h2 className={css.title}>Something went wrong ...</h2>

            <p className={css.message}>
                {error.message || 'Failed to load camper details'}
            </p>

            <button className={css.button} onClick={() => reset()}>
                Try again
            </button>
        </div>
    );
}