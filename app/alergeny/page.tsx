import type { Metadata } from "next";

import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";

import css from "./alergeny.module.css";

export const metadata: Metadata = {
    title: "Seznam alergenů",
    description:
        "Přehled 14 zákonem stanovených alergenů (EU č. 1169/2011) v našich pokrmech.",
};

type Allergen = {
    id: number;
    title: string;
    description: string;
};

const ALLERGENS: readonly Allergen[] = [
    {
        id: 1,
        title: "Obiloviny obsahující lepek",
        description:
            "Pšenice, žito, ječmen, oves i špalda – např. v chlebu, těstovinách nebo pivu.",
    },
    {
        id: 2,
        title: "Korýši",
        description: "Krevety, krabi, langusty a humři, včetně výrobků z nich.",
    },
    {
        id: 3,
        title: "Vejce",
        description:
            "Slepičí i jiná vejce a výrobky z nich, jako majonéza nebo pečivo.",
    },
    {
        id: 4,
        title: "Ryby",
        description:
            "Všechny druhy ryb a výrobky z nich – omáčky, vývary i ochucovadla.",
    },
    {
        id: 5,
        title: "Arašídy",
        description:
            "Burské oříšky a výrobky z nich, např. arašídové máslo a oleje.",
    },
    {
        id: 6,
        title: "Sójové boby",
        description: "Sója a sójové výrobky – tofu, sójová omáčka nebo edamame.",
    },
    {
        id: 7,
        title: "Mléko",
        description:
            "Mléko a mléčné výrobky včetně laktózy – sýr, máslo, smetana.",
    },
    {
        id: 8,
        title: "Skořápkové plody",
        description: "Mandle, lískové a vlašské ořechy, kešu, pistácie a další.",
    },
    {
        id: 9,
        title: "Celer",
        description: "Celer a výrobky z něj – v polévkách, koření i dresincích.",
    },
    {
        id: 10,
        title: "Hořčice",
        description: "Hořčice a výrobky z ní, často v dresincích a marinádách.",
    },
    {
        id: 11,
        title: "Sezamová semena",
        description:
            "Sezam a výrobky z něj, například tahini nebo posypané pečivo.",
    },
    {
        id: 12,
        title: "Oxid siřičitý a siřičitany",
        description: "Konzervanty (SO₂) v sušeném ovoci, nálevech nebo víně.",
    },
    {
        id: 13,
        title: "Vlčí bob (Lupina)",
        description: "Mouka a semena lupiny používané v pečivu a těstovinách.",
    },
    {
        id: 14,
        title: "Měkkýši",
        description:
            "Mušle, ústřice, šneci, chobotnice a oliheň, včetně výrobků z nich.",
    },
];

export default function AllergensPage() {
    return (
        <>
            <Header />

            <main className={css.page}>
                <div className={css.container}>
                    <header className={css.intro}>
                        <h1 className={css.title}>Seznam alergenů</h1>

                        <p className={css.subtitle}>
                            Přehled 14 zákonem stanovených alergenů dle nařízení
                            EU č. 1169/2011. Informace o alergenech v konkrétních
                            pokrmech Vám rádi poskytneme na vyžádání.
                        </p>
                    </header>

                    <section
                        className={css.grid}
                        aria-label="Přehled 14 alergenů"
                    >
                        {ALLERGENS.map((allergen) => (
                            <article key={allergen.id} className={css.card}>
                                <span className={css.badge} aria-hidden="true">
                                    {allergen.id}
                                </span>

                                <div className={css.cardBody}>
                                    <h2 className={css.cardTitle}>
                                        <span className={css.srOnly}>
                                            {`Alergen ${allergen.id}: `}
                                        </span>
                                        {allergen.title}
                                    </h2>

                                    <p className={css.cardDesc}>
                                        {allergen.description}
                                    </p>
                                </div>
                            </article>
                        ))}
                    </section>
                </div>
            </main>

            <Footer />
        </>
    );
}
