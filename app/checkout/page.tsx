import type { Metadata } from "next";

import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";

import CheckoutClient from "@/app/checkout/CheckoutClient";

export const metadata: Metadata = {
    title: "Zadání objednávky",
    description: "Dokončení objednávky sushi.",
};

export default function CheckoutPage() {
    return (
        <>
            <Header />
                <CheckoutClient />
            <Footer />
        </>
    );
}