"use client";

import { useQuery } from "@tanstack/react-query";

import { getRestaurantAbout } from "@/lib/api/restaurantAboutApi";
import type { RestaurantId } from "@/lib/restaurants";

import css from "./RestaurantAbout.module.css";

type Props = {
    restaurantId: RestaurantId;
};

export default function RestaurantAbout({ restaurantId }: Props) {
    const { data: about, isLoading, isError } = useQuery({
        queryKey: ["restaurant-about", restaurantId],
        queryFn: () => getRestaurantAbout(restaurantId),
        staleTime: 60_000,
    });

    if (isLoading || isError || !about) {
        return null;
    }

    return (
        <section id="o-nas" className={css.section}>
            <div className={css.content}>
                <span className={css.eyebrow}>O NÁS</span>

                <h2 className={css.title}>{about.title}</h2>

                {about.description && (
                    <p className={css.description}>
                        {about.description}
                    </p>
                )}

                <div className={css.features}>
                    <div className={css.feature}>
                        <span aria-hidden="true">🍃</span>
                        <strong>Čerstvé suroviny</strong>
                        <small>od prověřených dodavatelů</small>
                    </div>

                    <div className={css.feature}>
                        <span aria-hidden="true">👨‍🍳</span>
                        <strong>Zkušení kuchaři</strong>
                        <small>s vášní pro sushi</small>
                    </div>

                    <div className={css.feature}>
                        <span aria-hidden="true">🚚</span>
                        <strong>Rozvoz Kolín &amp; Jihlava</strong>
                        <small>rychle a spolehlivě</small>
                    </div>

                    <div className={css.feature}>
                        <span aria-hidden="true">♡</span>
                        <strong>Láska k detailu</strong>
                        <small>v každém pokrmu</small>
                    </div>
                </div>
            </div>

            {about.imageUrl && (
                <div className={css.imageWrapper}>
                    <img
                        src={about.imageUrl}
                        alt={`Interiér restaurace SushiMax ${restaurantId}`}
                        className={css.image}
                        loading="lazy"
                    />
                </div>
            )}
        </section>
    );
}


