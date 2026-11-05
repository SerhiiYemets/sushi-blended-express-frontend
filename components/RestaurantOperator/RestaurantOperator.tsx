import Link from "next/link";

import { LEGAL_ROUTES, RESTAURANT_OPERATORS } from "@/lib/legal";
import type { RestaurantId } from "@/lib/restaurants";

import css from "./RestaurantOperator.module.css";

type Props = {
    restaurantId: RestaurantId;
};

export default function RestaurantOperator({ restaurantId }: Props) {
    const operator = RESTAURANT_OPERATORS[restaurantId];

    return (
        <aside className={css.operator} aria-label="Provozovatel restaurace">
            <p className={css.text}>
                Provozovatel restaurace {operator.restaurantName}:{" "}
                <strong className={css.name}>{operator.operatorName}</strong>,
                IČO {operator.ico}
                {operator.dic && <>, DIČ {operator.dic}</>}, se sídlem{" "}
                {operator.registeredOffice}
            </p>

            <nav className={css.links} aria-label="Právní informace">
                <Link
                    href={`${LEGAL_ROUTES.terms}#provozovatel-${operator.restaurantId}`}
                    className={css.link}
                >
                    Obchodní podmínky
                </Link>

                <Link href={LEGAL_ROUTES.privacy} className={css.link}>
                    Ochrana osobních údajů
                </Link>
            </nav>
        </aside>
    );
}
