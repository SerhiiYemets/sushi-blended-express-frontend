import Spinner from "@/components/Spinner/Spinner";

import css from "./state.module.css";

export default function Loading() {
    return (
        <div className={css.wrapper}>
            <Spinner />
        </div>
    );
}
