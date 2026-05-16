import Link from "next/link";
import Image from "next/image";
import css from "@/components/Hero/Hero.module.css";

export default function Hero() {
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

                <Link href="/menu" className={css.heroBtn}>
                    Objednat
                </Link>
            </div>
        </section>
    );
}