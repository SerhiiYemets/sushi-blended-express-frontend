"use client";

import Link from "next/link";
import Logo from "@/components/Logo/Logo";
import css from "./Footer.module.css";

export default function Footer() {
    return (
        <footer id="contacts" className={css.footer}>
            <div className={css.inner}>
                <div className={css.top}>
                    <Link href="/" className={css.logoWrapper}>
                        <Logo />
                    </Link>

                    <div className={css.columns}>
                        <div className={css.block}>
                            <h3 className={css.label}>Adresa</h3>
                            <p className={css.value}>Karlovo náměstí 72</p>
                            <p className={css.value}>Kolín, 280 02</p>

                            <h3 className={css.label} style={{ marginTop: "20px" }}>Akceptujeme</h3>
                            <div className={css.payments}>
                                <span>💳</span>
                                <span>VISA</span>
                                <span>,&nbsp;MASTER CARD</span>
                            </div>
                        </div>

                        <div className={css.block}>
                            <h3 className={css.label}>Telefon</h3>
                            <a href="tel:+420777499970" className={css.phone}>
                                721 47 93 32
                            </a>
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
                            <Link href="#contacts" className={css.navLink}>Kontakt</Link>
                        </div>
                    </div>
                </div>

                <div className={css.bottom}>
                    <span className={css.copy}>
                        © {new Date().getFullYear()} SushiMax. 
                    </span>
                </div>
            </div>
        </footer>
    );
}
