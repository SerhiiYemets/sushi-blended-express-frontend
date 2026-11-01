import { notFound } from "next/navigation";

import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import EventsBanner from "@/components/Events/EventsBanner";
import RestaurantPageClient from "@/components/RestaurantPage/RestaurantPageClient";
import BackToCategories from "@/components/BackToCategories/BackToCategories";

import RestaurantAbout from "@/components/RestaurantAbout/RestaurantAbout";

import RestaurantGallery from "@/components/RestaurantGallery/RestaurantGallery";

import { isRestaurantId } from "@/lib/restaurants";

import css from "@/components/RestaurantPage/RestaurantPage.module.css";

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

                <main className={css.page}>
                    <EventsBanner restaurantId={restaurantId} />

                    <RestaurantPageClient restaurantId={restaurantId} />

                    <RestaurantAbout restaurantId={restaurantId} />

                    <RestaurantGallery restaurantId={restaurantId} />

                    <BackToCategories />
                </main>

            <Footer />
        </>
    );
}
