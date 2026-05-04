import type { Metadata } from "next";
import AuthNav from "@/components/AuthComponent/AuthNav/AuthNav";
import RegistrationForm from "@/components/AuthComponent/RegistrationForm/RegistrationForm";

export const metadata: Metadata = {
    title: "Registrace",
    description: "Vytvořte si účet SushiMax a objednávejte sushi online",
    openGraph: {
        title: "Registrace | SushiMax",
        description: "Vytvořte si účet SushiMax a objednávejte sushi online",
    },
    robots: { index: false },
};

export default function Page() {
    return (
        <>
            <AuthNav />
            <RegistrationForm />
        </>
    );
}