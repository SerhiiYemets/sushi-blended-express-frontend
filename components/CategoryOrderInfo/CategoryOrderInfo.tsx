import type { CategoryOrderInfo as OrderInfo } from "@/types/menu";

import css from "./CategoryOrderInfo.module.css";

type Props = {
    info: OrderInfo;
};

export default function CategoryOrderInfo({ info }: Props) {
    return (
        <aside className={css.block}>
            <p className={css.text}>{info.text}</p>

            <a href={`tel:${info.phone}`} className={css.phone}>
                {info.phoneLabel}
            </a>
        </aside>
    );
}
