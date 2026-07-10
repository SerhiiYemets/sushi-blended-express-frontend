import Link from "next/link";
import Logo from "@/components/Logo/Logo";
import css from "./Footer.module.css";

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer id="contacts" className={css.footer}>
            <div className={css.inner}>
                <div className={css.top}>
                    <Link href="/" className={css.logoWrapper}>
                        <Logo />
                    </Link>

                    <div className={css.columns}>
                        <div className={css.block}>
                            <h3 className={css.label}>Adresa - Kolín</h3>
                            <p className={css.value}>Karlovo náměstí 72</p>
                            <p className={css.value}>Kolín, 280 02</p>

                            <h3 className={css.label}>Adresa - Jihlava</h3>
                            <p className={css.value}>Úzká 635/1</p>
                            <p className={css.value}>Jihlava, 586 01</p>

                            <h3 className={css.label} style={{ marginTop: "20px" }}>Akceptujeme</h3>
                            <div className={css.payments}>
                                <span>💳</span>
                                <span>VISA</span>
                                <span>,&nbsp;MASTER CARD</span>
                            </div>
                        </div>

                        <div className={css.block}>
                            <h3 className={css.label}>Kolín</h3>

                            <a href="tel:+420721479332" className={css.phone}>
                                721 479 332
                            </a>

                            <div className={css.socials}>
                                <Link href="https://www.instagram.com/sushimax_Kolin.cz/">
                                    <svg className={css.instagramIcon} width="24" height="24">
                                        <use href="/sprite.svg#instagram" />
                                    </svg>
                                </Link>

                                <Link href="https://www.facebook.com/profile.php?id=100064335685391">
                                    <svg className={css.instagramIcon} width="24" height="24">
                                        <use href="/sprite.svg#facebook" />
                                    </svg>
                                </Link>
                            </div>
                            
                            <h3 className={css.label}>Jihlava</h3>

                            <a href="tel:+420777499970" className={css.phone}>
                                777 499 970
                            </a>

                            <div className={css.socials}>
                                <Link href="https://www.instagram.com/sushimax_jihlava.cz/">
                                    <svg className={css.instagramIcon} width="24" height="24">
                                        <use href="/sprite.svg#instagram" />
                                    </svg>
                                </Link>

                                <Link href="https://www.facebook.com/p/SushiMax-Jihlava-61571150205641/">
                                    <svg className={css.instagramIcon} width="24" height="24">
                                        <use href="/sprite.svg#facebook" />
                                    </svg>
                                </Link>
                            </div>
                        </div>

                        <div className={css.block}>
                            <h3 className={css.label}>Otevírací doba</h3>
                            <p className={css.value}>Pondělí – Neděle</p>
                            <p className={css.value}>10:00 – 22:00</p>
                        </div>

                        <div className={css.block}>
                            <h3 className={css.label}>Navigace</h3>
                            <Link href="/" className={css.navLink}>Domů</Link>
                            <Link href="/menu" className={css.navLink}>Menu</Link>
                            <a href="#contacts" className={css.navLink}>Kontakt</a>
                        </div>
                    </div>
                </div>

                <div className={css.bottom}>
                    <span className={css.copy}>
                        © {year} SushiMax. Všechna práva vyhrazena.
                    </span>

                    <a
                        className={css.copy}
                        href="https://serhii-yemets-portfolio.vercel.app/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Web vytvořil Serhii Yemets.
                    </a>
                </div>
            </div>
        </footer>
    );
}
