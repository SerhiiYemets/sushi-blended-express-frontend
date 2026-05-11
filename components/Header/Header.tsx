"use client";

import { memo, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

import css from "./Header.module.css";

import Logo from "@/components/Logo/Logo";
import Logout from "@/components/Logout/Logout";
import ThemeToggle from "@/components/ThemeToggle/ThemeToggle";

import { useAuthStore } from "@/lib/store/authStore";
import { useCartStore } from "@/lib/store/cartStore";

const NAV_LINKS = [
    { href: "/", label: "Domů" },
    { href: "/menu", label: "Menu" },
] as const;

const selectUser = (s: ReturnType<typeof useAuthStore.getState>) => s.user;
const selectAuthHydrated = (s: ReturnType<typeof useAuthStore.getState>) =>
    s.isHydrated;
const selectCartCount = (s: ReturnType<typeof useCartStore.getState>) =>
    s.items.reduce((acc, item) => acc + item.quantity, 0);

function SearchIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
        </svg>
    );
}

function CartIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M3 3h2l2.4 12.3a2 2 0 0 0 2 1.7h8.7a2 2 0 0 0 2-1.6L21.5 8H6" />
            <circle cx="9.5" cy="20.5" r="1.5" />
            <circle cx="17.5" cy="20.5" r="1.5" />
        </svg>
    );
}

function ProfileIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21a8 8 0 0 1 16 0" />
        </svg>
    );
}

const SearchBox = memo(function SearchBox({
    onSubmit,
    variant,
}: {
    onSubmit: (query: string) => void;
    variant: "desktop" | "mobile";
}) {
    const [query, setQuery] = useState("");

    const submit = () => {
        const trimmed = query.trim();
        if (!trimmed) return;
        onSubmit(trimmed);
        setQuery("");
    };

    if (variant === "mobile") {
        return (
            <div className={css.mobileSearch}>
                <SearchIcon className={css.mobileSearchIcon} />
                <input
                    type="search"
                    placeholder="Hledat sushi..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && submit()}
                    className={css.mobileSearchInput}
                    aria-label="Hledat sushi"
                />
            </div>
        );
    }

    return (
        <div className={css.searchBox}>
            <span className={css.searchIcon} aria-hidden>
                <SearchIcon />
            </span>
            <input
                type="search"
                placeholder="Hledat sushi..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submit()}
                className={css.searchInput}
                aria-label="Hledat sushi"
            />
            <button
                type="button"
                onClick={submit}
                className={css.searchBtn}
            >
                Hledat
            </button>
        </div>
    );
});

export default function Header() {
    const pathname = usePathname();
    const router = useRouter();

    const user = useAuthStore(selectUser);
    const isHydrated = useAuthStore(selectAuthHydrated);
    const totalCount = useCartStore(selectCartCount);

    const [menuOpenAt, setMenuOpenAt] = useState<string | null>(null);
    const menuOpen = menuOpenAt === pathname;

    const closeMenu = useCallback(() => setMenuOpenAt(null), []);
    const toggleMenu = useCallback(
        () => setMenuOpenAt((prev) => (prev === pathname ? null : pathname)),
        [pathname]
    );

    useEffect(() => {
        if (!menuOpen) return;
        const original = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = original;
        };
    }, [menuOpen]);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setMenuOpenAt(null);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    const handleSearch = useCallback(
        (query: string) => {
            router.push(`/menu?search=${encodeURIComponent(query)}`);
            setMenuOpenAt(null);
        },
        [router]
    );

    const scrollToContacts = useCallback(() => {
        setMenuOpenAt(null);
        if (pathname !== "/") {
            router.push("/#contacts");
            return;
        }
        const el = document.getElementById("contacts");
        if (el) el.scrollIntoView({ behavior: "smooth" });
    }, [pathname, router]);

    return (
        <header className={css.header}>
            <div className={css.inner}>
                <Link href="/" className={css.logoWrapper} onClick={closeMenu}>
                    <Logo priority />
                </Link>

                <SearchBox onSubmit={handleSearch} variant="desktop" />

                <nav className={css.nav}>
                    {NAV_LINKS.map(({ href, label }) => (
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

                    <button
                        type="button"
                        onClick={scrollToContacts}
                        className={css.navLink}
                    >
                        Kontakt
                    </button>
                </nav>

                <div className={css.rightSide}>
                    <a href="tel:+420721479332" className={css.phone}>
                        +420 721 479 332
                    </a>

                    <Link
                        href="/cart"
                        className={css.cart}
                        aria-label={`Košík (${totalCount})`}
                    >
                        <CartIcon />
                        {totalCount > 0 && (
                            <span className={css.cartCount}>{totalCount}</span>
                        )}
                    </Link>

                    <div className={css.auth} aria-busy={!isHydrated}>
                        {!isHydrated ? (
                            <span className={css.authSkeleton} aria-hidden />
                        ) : user ? (
                            <>
                                <Link
                                    href="/profile"
                                    className={css.avatarLink}
                                    aria-label={`Profil ${user.name}`}
                                >
                                    {user.avatarUrl ? (
                                        <Image
                                            src={user.avatarUrl}
                                            alt={user.name}
                                            width={32}
                                            height={32}
                                            sizes="32px"
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
                                <Link
                                    href="/register"
                                    className={css.registerBtn}
                                >
                                    Registrace
                                </Link>
                            </>
                        )}
                    </div>

                    <ThemeToggle />
                </div>

                <button
                    type="button"
                    className={`${css.burger} ${menuOpen ? css.burgerOpen : ""}`}
                    onClick={toggleMenu}
                    aria-label={menuOpen ? "Zavřít menu" : "Otevřít menu"}
                    aria-expanded={menuOpen}
                    aria-controls="mobile-menu"
                >
                    <span className={css.burgerLine}></span>
                    <span className={css.burgerLine}></span>
                    <span className={css.burgerLine}></span>
                </button>
            </div>

            <div
                id="mobile-menu"
                className={`${css.mobileMenu} ${menuOpen ? css.mobileMenuOpen : ""}`}
                aria-hidden={!menuOpen}
            >
                <SearchBox onSubmit={handleSearch} variant="mobile" />

                <nav className={css.mobileNav}>
                    {NAV_LINKS.map(({ href, label }) => (
                        <Link
                            key={href}
                            href={href}
                            className={`${css.mobileLink} ${
                                pathname === href ? css.mobileLinkActive : ""
                            }`}
                            onClick={closeMenu}
                        >
                            {label}
                        </Link>
                    ))}

                    <button
                        type="button"
                        onClick={scrollToContacts}
                        className={css.mobileLink}
                    >
                        Kontakt
                    </button>

                    <Link
                        href="/cart"
                        className={css.mobileLink}
                        onClick={closeMenu}
                    >
                        <span className={css.mobileLinkInline}>
                            <CartIcon />
                            Košík
                        </span>
                        {totalCount > 0 && (
                            <span className={css.mobileCount}>{totalCount}</span>
                        )}
                    </Link>

                    <a href="tel:+420721479332" className={css.mobileLink}>
                        +420 721 479 332
                    </a>
                </nav>

                <div className={css.mobileAuth}>
                    {!isHydrated ? null : user ? (
                        <>
                            <Link
                                href="/profile"
                                className={css.mobileProfile}
                                onClick={closeMenu}
                            >
                                <ProfileIcon />
                                {user.name}
                            </Link>
                            <Logout />
                        </>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className={css.mobileLoginBtn}
                                onClick={closeMenu}
                            >
                                Přihlášení
                            </Link>
                            <Link
                                href="/register"
                                className={css.mobileRegisterBtn}
                                onClick={closeMenu}
                            >
                                Registrace
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
