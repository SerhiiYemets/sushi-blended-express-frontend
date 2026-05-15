import Image from "next/image";
import css from "@/components/Hero/Hero.module.css";

export default function Hero() {
    return (
        <section className={css.hero}>
            <Image
                src="/Hero.jpg"
                alt="Sushi hero"
                fill
                priority
                sizes="100vw"
                className={css.heroImage}
            />

            <div className={css.heroContent}>
                <h1 className={css.heroTitle}>Nejlepší sushi v Kolíně</h1>
                <p className={css.heroSubtitle}>Čerstvé, rychlé, chutné 🍣</p>
                <a href="/menu" className={css.heroBtn}>Objednat</a>
            </div>
        </section>
    );
}