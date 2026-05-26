"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

import { requestRestaurantSwitch } from "@/lib/store/cartStore";
import type { RestaurantId } from "@/lib/store/restaurantStore";

import css from "@/components/Hero/Hero.module.css";

export default function Hero() {
    const router = useRouter();

    const goToMenu = (restaurant: RestaurantId) => {
        requestRestaurantSwitch(restaurant);
        router.push("/menu");
    };

    return (
        <section className={css.hero}>
            <Image
                src="/Hero.webp"
                alt="Sushi hero"
                fill
                priority
                sizes="100vw"
                className={css.heroImage}
            />

            <div className={css.heroContent}>
                <h1 className={css.heroTitle}>
                    <span>Nejlepší sushi</span>
                    <span>v Kolíně a Jihlavě</span>
                </h1>

                <p className={css.heroSubtitle}>
                    Čerstvé, rychlé, chutné 🍣
                </p>

                <div className={css.heroCtas}>
                    <button
                        type="button"
                        onClick={() => goToMenu("kolin")}
                        className={`${css.heroBtn} ${css.heroBtnPrimary}`}
                        aria-label="Otevřít menu pro Kolín"
                    >
                        <span className={css.heroBtnPin} aria-hidden>
                            📍
                        </span>
                        <span className={css.heroBtnLabel}>Menu Kolín</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => goToMenu("jihlava")}
                        className={`${css.heroBtn} ${css.heroBtnSecondary}`}
                        aria-label="Otevřít menu pro Jihlavu"
                    >
                        <span className={css.heroBtnPin} aria-hidden>
                            📍
                        </span>
                        <span className={css.heroBtnLabel}>Menu Jihlava</span>
                    </button>
                </div>
            </div>
        </section>
    );
}
