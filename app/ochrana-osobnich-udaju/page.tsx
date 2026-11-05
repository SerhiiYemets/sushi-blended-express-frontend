import type { Metadata } from "next";
import Link from "next/link";

import LegalPage, {
    LegalTable,
    OperatorCards,
} from "@/components/LegalPage/LegalPage";

import { LEGAL_PAGES_NOINDEX, LEGAL_ROUTES } from "@/lib/legal";

export const metadata: Metadata = {
    title: "Ochrana osobních údajů",
    description:
        "Zásady zpracování osobních údajů zákazníků restaurací SushiMax Kolín a SushiMax Jihlava.",
    robots: LEGAL_PAGES_NOINDEX ? { index: false, follow: true } : undefined,
};

export default function PrivacyPage() {
    return (
        <LegalPage
            title="Ochrana osobních údajů"
            lead="Zásady zpracování osobních údajů zákazníků webu sushimax.cz podle nařízení Evropského parlamentu a Rady (EU) 2016/679 (GDPR) a zákona č. 110/2019 Sb., o zpracování osobních údajů."
        >
            <section id="spravci">
                <h2>1. Správci osobních údajů</h2>
                <p>
                    Restaurace SushiMax Kolín a&nbsp;SushiMax Jihlava provozují
                    dva samostatní podnikatelé. Každý z&nbsp;nich je samostatným
                    správcem osobních údajů:
                </p>
                <ul>
                    <li>
                        u&nbsp;objednávek z&nbsp;restaurace{" "}
                        <strong>SushiMax Kolín</strong> je správcem Maksym
                        Bondarchuk,
                    </li>
                    <li>
                        u&nbsp;objednávek z&nbsp;restaurace{" "}
                        <strong>SushiMax Jihlava</strong> je správcem společnost
                        SushiMax s.r.o.
                    </li>
                </ul>
                <OperatorCards />
                <p>
                    Uživatelský účet na webu lze využít k&nbsp;objednávkám
                    z&nbsp;obou restaurací. Každý provozovatel zpracovává údaje
                    z&nbsp;uživatelského účtu pouze v&nbsp;rozsahu nezbytném pro
                    vyřízení objednávek podaných v&nbsp;jeho restauraci.
                </p>
                <p>
                    Se všemi dotazy ke zpracování osobních údajů se můžete
                    obracet na kontakty uvedené výše.
                </p>
            </section>

            <section id="kategorie-udaju">
                <h2>2. Kategorie zpracovávaných osobních údajů</h2>
                <ul>
                    <li>
                        <strong>Identifikační a&nbsp;kontaktní údaje:</strong>{" "}
                        jméno, příjmení, telefonní číslo a&nbsp;e-mailová
                        adresa.
                    </li>
                    <li>
                        <strong>Údaje o&nbsp;doručení:</strong> adresa doručení,
                        zeměpisné souřadnice místa doručení zvoleného na mapě,
                        vzdálenost od restaurace a&nbsp;výše dopravného.
                    </li>
                    <li>
                        <strong>Údaje o&nbsp;objednávce:</strong> objednané
                        produkty a&nbsp;ceny, způsob doručení a&nbsp;platby,
                        zvolený čas doručení, počet osob, poznámka
                        k&nbsp;objednávce, datum a&nbsp;čas vytvoření
                        objednávky a&nbsp;její stav.
                    </li>
                    <li>
                        <strong>Údaje uživatelského účtu:</strong> jméno,
                        e-mail a&nbsp;heslo (heslo ukládáme pouze v&nbsp;podobě
                        kryptografického otisku), volitelně příjmení, telefon,
                        adresa, číslo bytu, poznámka k&nbsp;doručení,
                        preferovaný způsob doručení a&nbsp;platby a&nbsp;počet
                        osob, dále obsah košíku a&nbsp;historie objednávek.
                    </li>
                    <li>
                        <strong>Technické údaje:</strong> přihlašovací údaje
                        uložené v&nbsp;cookies a&nbsp;technické záznamy serveru,
                        které mohou obsahovat IP adresu, informace
                        o&nbsp;prohlížeči a&nbsp;další údaje z&nbsp;požadavků na
                        server.
                    </li>
                </ul>
                <p>
                    Do poznámky k&nbsp;objednávce můžete uvést také informace
                    o&nbsp;alergiích nebo jiných stravovacích omezeních. Tyto
                    informace využíváme výhradně pro přípravu vaší objednávky.
                    Do poznámky prosím neuvádějte údaje, které nejsou pro
                    vyřízení objednávky potřebné.
                </p>
            </section>

            <section id="ucely-a-pravni-zaklady">
                <h2>3. Účely a&nbsp;právní základy zpracování</h2>
                <LegalTable label="Účely a právní základy zpracování">
                    <thead>
                        <tr>
                            <th scope="col">Účel zpracování</th>
                            <th scope="col">Právní základ</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                Přijetí, posouzení, příprava a&nbsp;doručení
                                nebo předání objednávky, komunikace
                                k&nbsp;objednávce včetně e-mailových oznámení
                                a&nbsp;telefonického upřesnění
                            </td>
                            <td>
                                Plnění smlouvy a&nbsp;provedení opatření před
                                jejím uzavřením (čl.&nbsp;6 odst.&nbsp;1
                                písm.&nbsp;b) GDPR)
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Ověření, zda na adresu doručujeme,
                                a&nbsp;výpočet dopravného
                            </td>
                            <td>
                                Provedení opatření před uzavřením smlouvy
                                (čl.&nbsp;6 odst.&nbsp;1 písm.&nbsp;b) GDPR)
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Vedení uživatelského účtu, přihlášení,
                                předvyplnění údajů a&nbsp;historie objednávek
                            </td>
                            <td>
                                Plnění smlouvy o&nbsp;užívání uživatelského
                                účtu (čl.&nbsp;6 odst.&nbsp;1 písm.&nbsp;b)
                                GDPR)
                            </td>
                        </tr>
                        <tr>
                            <td>Vyřizování reklamací</td>
                            <td>
                                Plnění právní povinnosti (čl.&nbsp;6
                                odst.&nbsp;1 písm.&nbsp;c) GDPR)
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Plnění účetních a&nbsp;daňových povinností
                            </td>
                            <td>
                                Plnění právní povinnosti (čl.&nbsp;6
                                odst.&nbsp;1 písm.&nbsp;c) GDPR)
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Zabezpečení webu a&nbsp;ochrana před zneužitím
                                (například omezení počtu objednávek
                                z&nbsp;jedné IP adresy), řešení technických
                                chyb
                            </td>
                            <td>
                                Oprávněný zájem (čl.&nbsp;6 odst.&nbsp;1
                                písm.&nbsp;f) GDPR)
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Uplatnění, výkon a&nbsp;obhajoba právních
                                nároků
                            </td>
                            <td>
                                Oprávněný zájem (čl.&nbsp;6 odst.&nbsp;1
                                písm.&nbsp;f) GDPR)
                            </td>
                        </tr>
                    </tbody>
                </LegalTable>
                <p>
                    Údaje označené na webu jako povinné jsou nezbytné pro
                    vyřízení objednávky. Bez nich objednávku nelze odeslat.
                </p>
                <p>
                    Prostřednictvím webu nezasíláme obchodní sdělení, osobní
                    údaje nevyužíváme k&nbsp;marketingu a&nbsp;neprovádíme
                    automatizované rozhodování ani profilování.
                </p>
            </section>

            <section id="doba-uchovani">
                <h2>4. Doba uchování osobních údajů</h2>
                <p>
                    Osobní údaje uchováváme pouze po dobu nezbytnou
                    k&nbsp;naplnění účelu, pro který byly získány:
                </p>
                <ul>
                    <li>
                        <strong>údaje z&nbsp;objednávek</strong> po dobu
                        nezbytnou k&nbsp;vyřízení objednávky, případných
                        reklamací a&nbsp;uplatnění nároků ze smlouvy
                        a&nbsp;dále po dobu, kterou stanoví účetní a&nbsp;daňové
                        předpisy,
                    </li>
                    <li>
                        <strong>údaje uživatelského účtu</strong> po dobu
                        existence účtu; o&nbsp;zrušení účtu můžete kdykoli
                        požádat,
                    </li>
                    <li>
                        <strong>přihlašovací relace</strong> do odhlášení,
                        nejdéle 30&nbsp;dní od posledního obnovení přihlášení,
                    </li>
                    <li>
                        <strong>technické záznamy serveru</strong> po dobu
                        nezbytnou pro zajištění bezpečnosti a&nbsp;provozu webu.
                    </li>
                </ul>
                <p>
                    Po uplynutí doby uchování údaje vymažeme nebo
                    anonymizujeme.
                </p>
            </section>

            <section id="prijemci">
                <h2>5. Příjemci a&nbsp;zpracovatelé osobních údajů</h2>
                <p>
                    Osobní údaje zpřístupňujeme pouze v&nbsp;rozsahu nezbytném
                    pro vyřízení objednávky a&nbsp;provoz webu těmto příjemcům:
                </p>
                <ul>
                    <li>
                        <strong>pracovníkům restaurace</strong> a&nbsp;osobám
                        zajišťujícím doručení objednávky,
                    </li>
                    <li>
                        <strong>pokladnímu systému Poster</strong>, ve kterém
                        restaurace objednávky přijímá a&nbsp;zpracovává
                        (jméno, příjmení, telefon, e-mail, adresa doručení,
                        poznámka, počet osob, způsob platby a&nbsp;obsah
                        objednávky),
                    </li>
                    <li>
                        <strong>službě Brevo</strong>, která zajišťuje
                        odesílání e-mailů: restauraci oznámení o&nbsp;nové
                        objednávce se všemi jejími údaji, zákazníkovi oznámení
                        o&nbsp;přijetí nebo odmítnutí objednávky,
                    </li>
                    <li>
                        <strong>poskytovateli databáze MongoDB</strong>,
                        ve které jsou uloženy objednávky, uživatelské účty,
                        košíky a&nbsp;přihlašovací relace,
                    </li>
                    <li>
                        <strong>poskytovateli hostingových služeb</strong>, na
                        jehož serverech web a&nbsp;jeho serverová část běží,
                    </li>
                    <li>
                        <strong>službě OpenRouteService</strong> pro výpočet
                        vzdálenosti po silnici; předávají se pouze souřadnice
                        restaurace a&nbsp;místa doručení, a&nbsp;to jen
                        u&nbsp;adres mimo administrativní hranici města,
                    </li>
                    <li>
                        <strong>orgánům veřejné moci</strong>, pokud to
                        vyžaduje právní předpis.
                    </li>
                </ul>
                <p>
                    <strong>Služby, ke kterým se připojuje váš
                    prohlížeč.</strong> Při vyhledávání adresy a&nbsp;zobrazení
                    mapy na stránce zadání objednávky se váš prohlížeč přímo
                    připojuje ke službám projektu OpenStreetMap (vyhledávání
                    adres Nominatim a&nbsp;mapové podklady). Tyto služby obdrží
                    zadaný text adresy nebo souřadnice místa na mapě
                    a&nbsp;technické údaje, jako je IP adresa. Výchozí obrázek
                    profilu se načítá ze služby DiceBear a&nbsp;adresa obrázku
                    obsahuje jméno uživatele.
                </p>
            </section>

            <section id="predavani-mimo-eu">
                <h2>6. Předávání osobních údajů mimo EU</h2>
                <p>
                    Osobní údaje předáváme do zemí mimo Evropskou unii
                    a&nbsp;Evropský hospodářský prostor pouze za podmínek
                    stanovených v&nbsp;kapitole V&nbsp;GDPR, zejména na základě
                    rozhodnutí Evropské komise o&nbsp;odpovídající úrovni
                    ochrany nebo standardních smluvních doložek.
                </p>
            </section>

            <section id="zabezpeceni">
                <h2>7. Zabezpečení osobních údajů</h2>
                <p>
                    Přijali jsme technická a&nbsp;organizační opatření
                    k&nbsp;ochraně osobních údajů. Hesla ukládáme pouze
                    v&nbsp;podobě kryptografického otisku. Přihlašovací údaje
                    jsou uloženy v&nbsp;cookies, které nejsou přístupné
                    skriptům na stránce, a&nbsp;v&nbsp;databázi uchováváme
                    pouze otisky přihlašovacích tokenů.
                </p>
            </section>

            <section id="prava">
                <h2>8. Vaše práva</h2>
                <p>V&nbsp;souvislosti se zpracováním osobních údajů máte právo:</p>
                <ul>
                    <li>
                        na <strong>přístup</strong> ke svým osobním údajům
                        (čl.&nbsp;15 GDPR),
                    </li>
                    <li>
                        na <strong>opravu</strong> nepřesných údajů
                        (čl.&nbsp;16 GDPR),
                    </li>
                    <li>
                        na <strong>výmaz</strong> údajů (čl.&nbsp;17 GDPR),
                    </li>
                    <li>
                        na <strong>omezení zpracování</strong> (čl.&nbsp;18
                        GDPR),
                    </li>
                    <li>
                        na <strong>přenositelnost údajů</strong> (čl.&nbsp;20
                        GDPR),
                    </li>
                    <li>
                        vznést <strong>námitku</strong> proti zpracování
                        založenému na oprávněném zájmu (čl.&nbsp;21 GDPR).
                    </li>
                </ul>
            </section>

            <section id="uplatneni-prav">
                <h2>9. Jak svá práva uplatnit</h2>
                <p>
                    Svá práva uplatníte u&nbsp;provozovatele restaurace, ze
                    které jste objednávali, e-mailem nebo telefonicky na
                    kontaktech uvedených v&nbsp;oddílu&nbsp;1. Údaje
                    v&nbsp;uživatelském účtu můžete sami upravit ve svém
                    profilu. O&nbsp;zrušení účtu a&nbsp;výmaz údajů požádejte
                    e-mailem.
                </p>
                <p>
                    Na vaši žádost odpovíme bez zbytečného odkladu, nejpozději
                    do jednoho měsíce od jejího obdržení. V&nbsp;odůvodněných
                    případech lze tuto lhůtu prodloužit o&nbsp;další dva měsíce;
                    o&nbsp;prodloužení vás budeme informovat. Abychom chránili
                    vaše údaje, můžeme vás požádat o&nbsp;ověření totožnosti.
                </p>
            </section>

            <section id="stiznost">
                <h2>10. Právo podat stížnost</h2>
                <p>
                    Pokud se domníváte, že zpracováním vašich osobních údajů
                    dochází k&nbsp;porušení právních předpisů, máte právo podat
                    stížnost u&nbsp;dozorového úřadu, kterým je Úřad pro
                    ochranu osobních údajů (
                    <a
                        href="https://uoou.gov.cz"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        uoou.gov.cz
                    </a>
                    ).
                </p>
            </section>

            <section id="zmeny">
                <h2>11. Změny těchto zásad</h2>
                <p>
                    Tyto zásady můžeme aktualizovat, zejména při změně
                    používaných služeb nebo právních předpisů. Aktuální znění
                    je vždy zveřejněno na této stránce. Informace o&nbsp;cookies
                    najdete na stránce{" "}
                    <Link href={LEGAL_ROUTES.cookies}>
                        Zásady používání cookies
                    </Link>
                    .
                </p>
                <p>
                    Tyto zásady nabývají účinnosti dnem jejich zveřejnění na
                    webu.
                </p>
            </section>
        </LegalPage>
    );
}
