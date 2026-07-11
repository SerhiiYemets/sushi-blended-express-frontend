import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Script from "next/script";

import Providers from "@/components/Providers/Providers";

import "./globals.css";

const geist = Geist({
    variable: "--font-geist",
    subsets: ["latin"],
    display: "swap",
});

const themeInitScript = `(function(){
    try {
        var t = null;
        var raw = localStorage.getItem('theme');
        if (raw) {
            try {
                var parsed = JSON.parse(raw);
                t = parsed && parsed.state && parsed.state.theme;
            } catch(_) {}
        }
        if (t !== 'dark' && t !== 'light') {
            t = 'dark';
        }
        document.documentElement.setAttribute('data-theme', t);
    } catch(e) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
})();`;

export const metadata: Metadata = {
    metadataBase: new URL(
        "https://sushimax.cz"
    ),

    title: {
        default: "SushiMax – Rozvoz sushi Kolín a Jihlava",
        template: "%s | SushiMax",
    },

    description:
        "Čerstvé sushi s rozvozem v Kolíně a Jihlavě. Objednejte online sushi, sushi sety, maki, nigiri a další speciality s rychlým doručením.",

    keywords: [
        "sushi",
        "sushi delivery",
        "sushi Kolín",
        "sushi Jihlava",
        "rozvoz sushi",
        "online sushi",
        "sushi sety",
        "maki",
        "nigiri",
        "japonská kuchyně",
        "SushiMax",
    ],

    authors: [
        {
            name: "Serhii Yemets",
        },
    ],

    creator: "Serhii Yemets",

    openGraph: {
        title: "SushiMax",
        description:
            "Objednávejte čerstvé sushi online – rychlé doručení a moderní objednávkový systém.",
        url: "https://sushimax.cz",
        siteName: "SushiMax",
        locale: "cs_CZ",
        type: "website",
    },

    twitter: {
        card: "summary_large_image",
        title: "SushiMax",
        description:
            "Objednávejte sushi online rychle a jednoduše.",
    },

    robots: {
        index: true,
        follow: true,
    },

    icons: {
        icon: "/sushimaxlogo.png",
        shortcut: "/sushimaxlogo.png",
        apple: "/sushimaxlogo.png",
    },

    category: "food",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="cs"
            suppressHydrationWarning
            className={geist.variable}
        >
            <body>
                <Script
                    id="theme-init"
                    strategy="beforeInteractive"
                >
                    {themeInitScript}
                </Script>

                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    );
}



