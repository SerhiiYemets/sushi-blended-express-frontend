import type { Metadata } from "next";

import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import ProfilePage from "@/components/Profile/ProfilePage/ProfilePage";

export const metadata: Metadata = {
    title: "Můj profil",
};

export default function Profile() {
    return (
        <>
            <Header />
                <ProfilePage />
            <Footer />
        </>
    );
}
