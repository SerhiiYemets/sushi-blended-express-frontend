"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

import { requestRestaurantSwitch } from "@/lib/store/cartStore";
import type { RestaurantId } from "@/lib/restaurants";

import css from "@/components/Hero/Hero.module.css";

export default function Hero() {
    const router = useRouter();

    const goToMenu = (restaurant: RestaurantId) => {
        requestRestaurantSwitch(restaurant);
        router.push("/menu");
    };

    return (
        <section className={css.hero}>
            <div className={css.imageLayer}>
                <Image
                    src="/Hero.webp"
                    alt=""
                    fill
                    priority
                    sizes="100vw"
                    className={css.heroImage}
                />
                <div className={css.overlay} aria-hidden />
                <div className={css.grid} aria-hidden />
                <div className={css.glow} aria-hidden />
            </div>

            <div className={css.heroLayout}>
            <div className={css.heroContent}>
                <span className={css.eyebrow}>
                    <span className={css.eyebrowDot} aria-hidden />
                    Sushi delivery · Kolín &amp; Jihlava
                </span>

                <h1 className={css.heroTitle}>
                    <span className={css.titleLine}>Japonská chuť</span>
                    <span className={`${css.titleLine} ${css.titleLineAccent}`}>
                        Maximální dopad
                    </span>
                </h1>

                <p className={css.heroSubtitle}>
                    Čerstvé sushi, ostře balené, doručené zdarma během minut.
                    Vaše město. Vaše sushi. Hned teď.
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

                <ul className={css.bullets} aria-label="Klíčové výhody">
                    <li className={css.bullet}>
                        <span className={css.bulletIcon}>⚡</span>
                        <span>
                            <strong>30–45 min</strong> dodání
                        </span>
                    </li>
                    <li className={css.bullet}>
                        <span className={css.bulletIcon}>🍣</span>
                        <span>
                            <strong>Čerstvé denně</strong>, žádné mražené
                        </span>
                    </li>
                    <li className={css.bullet}>
                        <span className={css.bulletIcon}>🛵</span>
                        <span>
                            <strong>Doprava zdarma</strong> ve městě
                        </span>
                    </li>
                </ul>
            </div>

            <div className={css.heroVisual} aria-hidden>
                <div className={css.heroLogoGlow} />
                <Image
                    src="/logoHero.PNG"
                    alt=""
                    width={720}
                    height={720}
                    priority
                    sizes="(min-width: 1440px) 560px, (min-width: 1024px) 460px, (min-width: 768px) 380px, 280px"
                    className={css.heroLogo}
                />
            </div>
            </div>

        </section>
    );
}
