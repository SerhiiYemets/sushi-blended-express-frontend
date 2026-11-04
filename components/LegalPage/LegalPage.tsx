import type { ReactNode } from "react";
import Link from "next/link";

import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";

import {
    LEGAL_ROUTES,
    OPERATOR_LIST,
    type RestaurantOperator,
} from "@/lib/legal";

import css from "./LegalPage.module.css";

type LegalPageProps = {
    title: string;
    lead: ReactNode;
    children: ReactNode;
};

const RELATED_DOCUMENTS = [
    { href: LEGAL_ROUTES.terms, label: "Obchodní podmínky" },
    { href: LEGAL_ROUTES.privacy, label: "Ochrana osobních údajů" },
    { href: LEGAL_ROUTES.cookies, label: "Zásady používání cookies" },
] as const;

export default function LegalPage({ title, lead, children }: LegalPageProps) {
    return (
        <>
            <Header />

            <main className={css.page}>
                <article className={css.container}>
                    <header className={css.intro}>
                        <h1 className={css.title}>{title}</h1>
                        <p className={css.lead}>{lead}</p>
                    </header>

                    <div className={css.content}>{children}</div>

                    <nav
                        className={css.related}
                        aria-label="Další právní dokumenty"
                    >
                        {RELATED_DOCUMENTS.map((document) => (
                            <Link
                                key={document.href}
                                href={document.href}
                                className={css.relatedLink}
                            >
                                {document.label}
                            </Link>
                        ))}
                    </nav>
                </article>
            </main>

            <Footer />
        </>
    );
}

export function OperatorCards() {
    return (
        <div className={css.operators}>
            {OPERATOR_LIST.map((operator) => (
                <OperatorCard key={operator.restaurantId} operator={operator} />
            ))}
        </div>
    );
}

type LegalTableProps = {
    label: string;
    children: ReactNode;
};

export function LegalTable({ label, children }: LegalTableProps) {
    return (
        <div
            className={css.tableWrapper}
            tabIndex={0}
            role="region"
            aria-label={label}
        >
            <table className={css.table}>{children}</table>
        </div>
    );
}

function OperatorCard({ operator }: { operator: RestaurantOperator }) {
    return (
        <section
            id={`provozovatel-${operator.restaurantId}`}
            className={css.operator}
            aria-labelledby={`provozovatel-${operator.restaurantId}-title`}
        >
            <h3
                id={`provozovatel-${operator.restaurantId}-title`}
                className={css.operatorTitle}
            >
                {operator.restaurantName}
            </h3>

            <dl className={css.operatorList}>
                <dt>Provozovatel</dt>
                <dd>
                    {operator.operatorName}, {operator.legalForm}
                </dd>

                <dt>IČO</dt>
                <dd>{operator.ico}</dd>

                {operator.dic && (
                    <>
                        <dt>DIČ</dt>
                        <dd>{operator.dic}</dd>
                    </>
                )}

                <dt>Sídlo</dt>
                <dd>{operator.registeredOffice}</dd>

                {operator.registration && (
                    <>
                        <dt>Zápis</dt>
                        <dd>{operator.registration}</dd>
                    </>
                )}

                <dt>Provozovna</dt>
                <dd>{operator.restaurantAddress}</dd>

                <dt>Telefon</dt>
                <dd>
                    <a href={operator.phoneHref} className={css.link}>
                        {operator.phone}
                    </a>
                </dd>

                <dt>E-mail</dt>
                <dd>
                    <a href={`mailto:${operator.email}`} className={css.link}>
                        {operator.email}
                    </a>
                </dd>
            </dl>
        </section>
    );
}
