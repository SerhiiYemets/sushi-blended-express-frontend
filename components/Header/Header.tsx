"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
// import Image from "next/image";

import css from "./Header.module.css";

import Logo from "@/components/Logo/Logo";
// import Logout from "@/components/Logout/Logout";
import ThemeToggle from "@/components/ThemeToggle/ThemeToggle";

// import { useAuthStore } from "@/lib/store/authStore";
import { useCartStore } from "@/lib/store/cartStore";

export default function Header() {
    const pathname = usePathname();
    const router = useRouter();
    // const user = useAuthStore((s) => s.user);
    const items = useCartStore((s) => s.items);

    const [menuOpen, setMenuOpen] = useState(false);
    const [query, setQuery] = useState("");

    const totalCount = useMemo(
        () => items.reduce((acc, i) => acc + i.quantity, 0),
        [items]
    );

    const navLinks = [
        { href: "/", label: "Domů" },
        { href: "/menu", label: "Menu" },
        { href: "/contacts", label: "Kontakt" },
    ];

    const handleSearch = () => {
        if (!query.trim()) return;
        router.push(`/menu?search=${encodeURIComponent(query)}`);
        setQuery("");
        setMenuOpen(false);
    };

    const closeMenu = () => setMenuOpen(false);

    return (
        <header className={css.header}>
        <div className={css.inner}>
            <Link href="/" className={css.logoWrapper}>
                <Logo />
            </Link>

            <div className={css.searchBox}>
            <input
                type="text"
                placeholder="Hledat sushi..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className={css.searchInput}
            />
            <button onClick={handleSearch} className={css.searchBtn}>
                🔍
            </button>
            </div>

            <nav className={css.nav}>
            {navLinks.map(({ href, label }) => (
                <Link
                key={href}
                href={href}
                className={`${css.navLink} ${
                    pathname === href ? css.active : ""
                }`}
                >
                {label}
                </Link>
            ))}
            </nav>

            <div className={css.rightSide}>
            <a href="tel:+420123456789" className={css.phone}>
                +420 123 456 789
            </a>

            <Link href="/cart" className={css.cart}>
                🛒
                {totalCount > 0 && (
                <span className={css.cartCount}>{totalCount}</span>
                )}
            </Link>

            {/* AUTH
            <div className={css.auth}>
                {user ? (
                <>
                    <Link href="/profile" className={css.avatarLink}>
                    {user.avatarUrl ? (
                        <Image
                        src={user.avatarUrl}
                        alt={user.name}
                        width={32}
                        height={32}
                        className={css.avatar}
                        />
                    ) : (
                        <span className={css.avatarFallback}>
                        {user.name.charAt(0).toUpperCase()}
                        </span>
                    )}
                    </Link>
                    <Logout />
                </>
                ) : (
                <>
                    <Link href="/login" className={css.loginBtn}>
                    Přihlášení
                    </Link>
                    <Link href="/register" className={css.registerBtn}>
                    Registrace
                    </Link>
                </>
                )}
            </div> */}

            <ThemeToggle />
            </div>

            {/* BURGER */}
            <button
            className={css.burger}
            onClick={() => setMenuOpen((prev) => !prev)}
            >
            <span className={css.burgerLine}></span>
            <span className={css.burgerLine}></span>
            <span className={css.burgerLine}></span>
            </button>
        </div>

        {menuOpen && (
            <div className={css.mobileMenu}>
            <div className={css.mobileSearch}>
                <input
                type="text"
                placeholder="Hledat sushi..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className={css.mobileSearchInput}
                />
                <button
                onClick={handleSearch}
                className={css.mobileSearchBtn}
                >
                🔍
                </button>
            </div>

            {navLinks.map(({ href, label }) => (
                <Link
                key={href}
                href={href}
                className={css.mobileLink}
                onClick={closeMenu}
                >
                {label}
                </Link>
            ))}

            <a href="tel:+420123456789" className={css.mobileLink}>
                📞 +420 123 456 789
            </a>

            <Link
                href="/cart"
                className={css.mobileLink}
                onClick={closeMenu}
            >
                🛒 Košík ({totalCount})
            </Link>

            AUTH
            {/* {user ? (
                <>
                <Link
                    href="/profile"
                    className={css.mobileLink}
                    onClick={closeMenu}
                >
                    Profil
                </Link>
                <button className={css.mobileLink} onClick={closeMenu}>
                    <Logout />
                </button>
                </>
            ) : (
                <>
                <Link
                    href="/login"
                    className={css.mobileLink}
                    onClick={closeMenu}
                >
                    Přihlášení
                </Link>
                <Link
                    href="/register"
                    className={css.mobileLink}
                    onClick={closeMenu}
                >
                    Registrace
                </Link>
                </>
            )} */}
            </div>
        )}
        </header>
    );
}