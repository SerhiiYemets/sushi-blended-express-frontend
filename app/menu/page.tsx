import type { Metadata } from "next";
import { Suspense } from "react";

import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";

import EventsBanner from "@/components/Events/EventsBanner";

import MenuClient from "./MenuClient";

export const metadata: Metadata = {
    title: "Menu",
    description: "Naše menu – čerstvé sushi a další speciality.",
};

export default function MenuPage() {
    return (
        <>
            <Header />
                <EventsBanner restaurantId="kolin" />
            <Suspense>
                <MenuClient />
            </Suspense>
            <Footer />
        </>
    );
}
