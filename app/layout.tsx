import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import Providers from "@/components/Providers/Providers";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
    display: "swap",
    preload: true,
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
    display: "swap",
    preload: false,
});

export const metadata: Metadata = {
    title: {
        default: "SushiMax",
        template: "%s | SushiMax",
    },
    description: "Objednávejte sushi online – čerstvé, rychlé, chutné.",
};

const themeInitScript = `(function(){
    try {
        var t = localStorage.getItem('theme');
        if (!t && window.matchMedia('(prefers-color-scheme: dark)').matches) t = 'dark';
        if (t) document.documentElement.setAttribute('data-theme', t);
    } catch(e) {}
})();`;

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html
            lang="cs"
            suppressHydrationWarning
            className={`${geistSans.variable} ${geistMono.variable}`}
        >
            <head>
                <Script id="theme-init" strategy="beforeInteractive">
                    {themeInitScript}
                </Script>
            </head>

            <body>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
