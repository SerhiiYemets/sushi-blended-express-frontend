
import { notFound } from "next/navigation";

import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import EventsBanner from "@/components/Events/EventsBanner";
import RestaurantPageClient from "@/components/RestaurantPage/RestaurantPageClient";
import BackToCategories from "@/components/BackToCategories/BackToCategories";

import css from "@/components/RestaurantPage/RestaurantPage.module.css";

import { isRestaurantId } from "@/lib/restaurants";

type Props = {
    params: Promise<{
        restaurantId: string;
    }>;
};

export default async function RestaurantPage({ params }: Props) {
    const { restaurantId } = await params;

    if (!isRestaurantId(restaurantId)) {
        notFound();
    }

    return (
        <>
            <Header />

            <main>
                <EventsBanner restaurantId={restaurantId} />

                <RestaurantPageClient restaurantId={restaurantId} />

                <section id="o-nas" className={css.scrollTarget}>
                    <h2>O nás</h2>
                </section>

                <section id="galerie" className={css.scrollTarget}>
                    <h2>Galerie</h2>
                </section>

                <BackToCategories />
            </main>

            <Footer />
        </>
    );
}
