import css from "@/components/Hero/Hero.module.css"

export default function Hero() {
    return (
        <section className={css.hero}>
            <div className={css.heroContent}>
                <h1>Nejlepší sushi v Kolíně</h1>
                <p>Čerstvé, rychlé, chutné 🍣</p>
                <a href="/menu" className={css.heroBtn}> Objednat</a>
            </div>
        </section>
    );
}