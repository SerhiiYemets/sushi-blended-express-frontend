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
        var t = localStorage.getItem('theme');
        if (!t && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            t = 'dark';
        }
        if (t) {
            document.documentElement.setAttribute('data-theme', t);
        }
    } catch(e) {}
})();`;

export const metadata: Metadata = {
    metadataBase: new URL(
        "https://sushi-blended-express-frontend.vercel.app"
    ),

    title: {
        default: "SushiMax",
        template: "%s | SushiMax",
    },

    description:
        "Objednávejte čerstvé sushi online. Rychlé doručení, moderní objednávkový systém a skvělá chuť.",

    keywords: [
        "sushi",
        "sushi delivery",
        "online sushi",
        "restaurant",
        "food delivery",
        "japanese food",
        "takeaway",
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
        url: "https://sushi-blended-express-frontend.vercel.app",
        siteName: "SushiRoom",
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
        icon: "/icon.svg",
        shortcut: "/icon.svg",
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



