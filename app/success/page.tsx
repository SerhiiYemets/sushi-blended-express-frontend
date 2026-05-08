import Link from "next/link";

import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";

export default function SuccessPage() {
    return (
        <>
            <Header />

                <main
                    style={{
                        minHeight: "70vh",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        gap: "20px",
                        padding: "40px",
                        textAlign: "center",
                    }}
                >
                    <h1>
                        Děkujeme za objednávku
                    </h1>

                    <p>
                        Vaše objednávka byla
                        úspěšně přijata.
                    </p>

                    <Link href="/menu">
                        Zpět do menu
                    </Link>
                </main>

            <Footer />
        </>
    );
}