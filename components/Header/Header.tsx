"use client";

import { memo, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

import css from "./Header.module.css";

import Logo from "@/components/Logo/Logo";
import Logout from "@/components/Logout/Logout";
import ThemeToggle from "@/components/ThemeToggle/ThemeToggle";

import { useAuthStore } from "@/lib/store/authStore";
import { useCartCount } from "@/lib/store/cartStore";
import { useHydrated } from "@/hooks/useHydrated";

const NAV_LINKS = [
    { href: "/", label: "Domů" },
    { href: "/menu", label: "Menu" },
    { href: "/alergeny", label: "Seznam alergenů" },
] as const;

const selectUser = (s: ReturnType<typeof useAuthStore.getState>) => s.user;
const selectAuthHydrated = (s: ReturnType<typeof useAuthStore.getState>) =>
    s.isHydrated;

const CartIcon = memo(function CartIcon({ className }: { className?: string }) {
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
});

const ProfileIcon = memo(function ProfileIcon({ className }: { className?: string }) {
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
});

function AuthArea({ isHydrated }: { isHydrated: boolean }) {
    const user = useAuthStore(selectUser);

    if (!isHydrated) {
        return <span className={css.authPlaceholder} aria-hidden />;
    }

    if (user) {
        return (
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
                            unoptimized
                        />
                    ) : (
                        <span className={css.avatarFallback}>
                            {user.name.charAt(0).toUpperCase()}
                        </span>
                    )}
                </Link>
                <Logout />
            </>
        );
    }

    return (
        <>
            <Link href="/login" className={css.loginBtn}>
                Přihlášení
            </Link>
            <Link href="/register" className={css.registerBtn}>
                Registrace
            </Link>
        </>
    );
}

function MobileAuthArea({
    isHydrated,
    onClose,
}: {
    isHydrated: boolean;
    onClose: () => void;
}) {
    const user = useAuthStore(selectUser);

    if (!isHydrated) return null;

    if (user) {
        return (
            <>
                <Link
                    href="/profile"
                    className={css.mobileProfile}
                    onClick={onClose}
                >
                    <ProfileIcon />
                    {user.name}
                </Link>
                <Logout />
            </>
        );
    }

    return (
        <>
            <Link href="/login" className={css.mobileLoginBtn} onClick={onClose}>
                Přihlášení
            </Link>
            <Link
                href="/register"
                className={css.mobileRegisterBtn}
                onClick={onClose}
            >
                Registrace
            </Link>
        </>
    );
}

function CartBadge() {
    const hydrated = useHydrated();
    const totalCount = useCartCount();

    const count = hydrated ? totalCount : 0;

    return (
        <Link
            href="/cart"
            className={css.cart}
            aria-label={`Košík (${count})`}
        >
            <CartIcon />
            {count > 0 && <span className={css.cartCount}>{count}</span>}
        </Link>
    );
}

function MobileCartCount() {
    const hydrated = useHydrated();
    const totalCount = useCartCount();
    if (!hydrated || totalCount === 0) return null;
    return <span className={css.mobileCount}>{totalCount}</span>;
}

export default function Header() {
    const pathname = usePathname();
    const router = useRouter();
    const isHydrated = useAuthStore(selectAuthHydrated);
    const hydrated = useHydrated();

    const [menuOpenAt, setMenuOpenAt] = useState<string | null>(null);
    const menuOpen = menuOpenAt === pathname;

    const menuRef = useRef<HTMLDivElement | null>(null);
    const burgerRef = useRef<HTMLButtonElement | null>(null);

    const closeMenu = useCallback(() => setMenuOpenAt(null), []);
    const toggleMenu = useCallback(
        () => setMenuOpenAt((prev) => (prev === pathname ? null : pathname)),
        [pathname]
    );

    useEffect(() => {
        if (!menuOpen) return;
        const root = document.documentElement;
        const originalOverflow = root.style.overflow;
        const originalPaddingRight = root.style.paddingRight;
        const scrollbarWidth = window.innerWidth - root.clientWidth;

        root.style.overflow = "hidden";
        if (scrollbarWidth > 0) {
            root.style.paddingRight = `${scrollbarWidth}px`;
        }

        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setMenuOpenAt(null);
        };

        // Close when tapping/clicking outside the panel and the burger toggle.
        // pointerdown covers both touch and mouse on iOS, Android and tablets.
        const onPointerDown = (e: PointerEvent) => {
            const target = e.target as Node | null;
            if (!target) return;
            if (menuRef.current?.contains(target)) return;
            if (burgerRef.current?.contains(target)) return;
            setMenuOpenAt(null);
        };

        window.addEventListener("keydown", onKey);
        document.addEventListener("pointerdown", onPointerDown);

        return () => {
            root.style.overflow = originalOverflow;
            root.style.paddingRight = originalPaddingRight;
            window.removeEventListener("keydown", onKey);
            document.removeEventListener("pointerdown", onPointerDown);
        };
    }, [menuOpen]);

    const scrollToContacts = useCallback(() => {
        setMenuOpenAt(null);
        if (pathname !== "/") {
            router.push("/#contacts");
            return;
        }
        const el = document.getElementById("contacts");
        if (el) el.scrollIntoView({ behavior: "smooth" });
    }, [pathname, router]);

    const isActive = (href: string) => hydrated && pathname === href;

    return (
        <>
            <header className={css.header}>
                <div className={css.inner}>
                <Link href="/" className={css.logoWrapper} onClick={closeMenu}>
                    <Logo priority />
                </Link>

                <nav className={css.nav}>
                    {NAV_LINKS.map(({ href, label }) => (
                        <Link
                            key={href}
                            href={href}
                            aria-current={isActive(href) ? "page" : undefined}
                            className={
                                isActive(href)
                                    ? `${css.navLink} ${css.active}`
                                    : css.navLink
                            }
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
                    <CartBadge />

                    <div className={css.auth} aria-busy={!isHydrated}>
                        <AuthArea isHydrated={isHydrated} />
                    </div>

                    <ThemeToggle />
                </div>

                <button
                    ref={burgerRef}
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
            </header>

            {/* Rendered as a sibling of <header>, NOT a child: the header's
                backdrop-filter establishes a containing block, which would make
                this position:fixed panel resolve against the header box instead
                of the viewport. Kept out of that filtered ancestor, `fixed`
                anchors to the viewport so the menu always opens under the
                burger regardless of scroll position. */}
            <div
                ref={menuRef}
                id="mobile-menu"
                className={`${css.mobileMenu} ${menuOpen ? css.mobileMenuOpen : ""}`}
                aria-hidden={!menuOpen}
            >
                <nav className={css.mobileNav}>
                    {NAV_LINKS.map(({ href, label }) => (
                        <Link
                            key={href}
                            href={href}
                            aria-current={isActive(href) ? "page" : undefined}
                            className={
                                isActive(href)
                                    ? `${css.mobileLink} ${css.mobileLinkActive}`
                                    : css.mobileLink
                            }
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
                        <MobileCartCount />
                    </Link>

                    {/* <a href="tel:+420721479332" className={css.mobileLink}>
                        +420 721 479 332
                    </a> */}
                </nav>

                <div className={css.mobileAuth}>
                    <MobileAuthArea isHydrated={isHydrated} onClose={closeMenu} />
                </div>
            </div>
        </>
    );
}
