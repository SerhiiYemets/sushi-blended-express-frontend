import type { Metadata } from "next";

import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";

import MenuClient from "./MenuClient";

export const metadata: Metadata = {
    title: "Menu",
    description: "Naše menu – čerstvé sushi a další speciality.",
};

export default function MenuPage() {
    return (
        <>
            <Header />
                <MenuClient />
            <Footer />
        </>
    );
}
