import type { Metadata } from "next";
import AuthNav from "@/components/AuthComponent/AuthNav/AuthNav";
import LoginForm from "@/components/AuthComponent/LoginForm/LoginForm";

export const metadata: Metadata = {
    title: "Přihlášení",
    description: "Přihlaste se do svého účtu SushiMax",
    openGraph: {
        title: "Přihlášení | SushiMax",
        description: "Přihlaste se do svého účtu SushiMax",
    },
};

export default function Page() {
    return (
        <>
            <AuthNav />
            <LoginForm />
        </>
    );
}