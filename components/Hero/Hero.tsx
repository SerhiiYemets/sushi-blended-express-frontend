import Image from "next/image";
import css from "@/components/Hero/Hero.module.css";

export default function Hero() {
    return (
        <section className={css.hero}>
            <Image
                src="https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=1600&q=70"
                alt=""
                fill
                priority
                fetchPriority="high"
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
