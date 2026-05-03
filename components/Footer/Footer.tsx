"use client";

import css from "@/components/Footer/Footer.module.css";
import Logo from "../Logo/Logo";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className={css.footer}>
            <div className={css.container}>
                <div className={css.grid}>
                
                <Link href="/" className={css.logoWrapper}>
                    <Logo />
                </Link>

                    <div className={css.block}>
                        <h3>Adresa:</h3>
                        <p>Úzká 635/1, Jihlava, 586 01</p>

                        <h4>Akceptujeme:</h4>
                        <div className={css.payments}>
                            <span>💳</span>
                            <span>VISA</span>
                            <span>,  MASTER CARD</span>
                        </div>
                    </div>

                    <div className={css.block}>
                        <h3>Telefon:</h3>
                        <p className={css.phone}>777 49 99 70</p>
                    </div>

                    <div className={css.block}>
                        <h3>Otevírací doba:</h3>
                        <div className={css.hours}>
                            <span>Pondělí - Neděle</span>
                            <span>10:00 - 22:00</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}