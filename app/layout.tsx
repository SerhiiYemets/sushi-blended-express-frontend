import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Providers from "@/components/Providers/Providers";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: {
        default: "SushiMax",
        template: "%s | SushiMax",
    },
    description: "Objednávejte sushi online – čerstvé, rychlé, chutné.",
};

// Runs before React hydrates → prevents FOUC on theme-dependent styles
const themeInitScript = `(function(){
  try {
    var t = localStorage.getItem('theme');
    if (!t && window.matchMedia('(prefers-color-scheme: dark)').matches) t = 'dark';
    if (t) document.documentElement.setAttribute('data-theme', t);
  } catch(e) {}
})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html
            lang="cs"
            suppressHydrationWarning
            className={`${geistSans.variable} ${geistMono.variable}`}
        >
            <head>
                {/* eslint-disable-next-line @next/next/no-sync-scripts */}
                <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
            </head>
            <body>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
