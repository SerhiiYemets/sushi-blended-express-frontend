import type { Metadata } from "next";
import Link from "next/link";

import LegalPage, { LegalTable } from "@/components/LegalPage/LegalPage";

import { LEGAL_PAGES_NOINDEX, LEGAL_ROUTES } from "@/lib/legal";

export const metadata: Metadata = {
    title: "Zásady používání cookies",
    description:
        "Přehled cookies a místního úložiště prohlížeče, které používá web sushimax.cz.",
    robots: LEGAL_PAGES_NOINDEX ? { index: false, follow: true } : undefined,
};

export default function CookiesPage() {
    return (
        <LegalPage
            title="Zásady používání cookies"
            lead="Přehled cookies a dalších technologií pro ukládání dat v prohlížeči, které používá web sushimax.cz."
        >
            <section id="uvod">
                <h2>1. Úvodní informace</h2>
                <p>
                    Web sushimax.cz slouží k&nbsp;objednávání z&nbsp;restaurací
                    SushiMax Kolín a&nbsp;SushiMax Jihlava, které provozují dva
                    samostatní podnikatelé. Jejich identifikační
                    a&nbsp;kontaktní údaje najdete v&nbsp;oddílu{" "}
                    <Link href={`${LEGAL_ROUTES.terms}#provozovatele`}>
                        Identifikace provozovatelů
                    </Link>{" "}
                    obchodních podmínek.
                </p>
                <p>
                    Tyto zásady popisují, jaké údaje web ukládá ve vašem
                    prohlížeči, k&nbsp;jakému účelu a&nbsp;na jak dlouho.
                </p>
            </section>

            <section id="technologie">
                <h2>2. Cookies a&nbsp;místní úložiště prohlížeče</h2>
                <p>
                    <strong>HTTP cookies</strong> jsou malé soubory, které
                    server ukládá do vašeho prohlížeče. Prohlížeč je při
                    dalších požadavcích automaticky posílá zpět na server.
                </p>
                <p>
                    <strong>Místní úložiště (localStorage)</strong> je prostor
                    v&nbsp;prohlížeči, do kterého si web ukládá data pro své
                    fungování. Na rozdíl od cookies se tato data automaticky
                    neodesílají na server a&nbsp;zůstávají uložena, dokud je web
                    nebo vy nesmažete.
                </p>
                <p>
                    Jiné technologie ukládání dat v&nbsp;prohlížeči, jako je
                    úložiště relace (sessionStorage) nebo databáze IndexedDB,
                    web nepoužívá.
                </p>
            </section>

            <section id="prehled">
                <h2>3. Přehled používaných technologií</h2>
                <LegalTable label="Přehled cookies a položek místního úložiště">
                    <thead>
                        <tr>
                            <th scope="col">Název</th>
                            <th scope="col">Účel</th>
                            <th scope="col">Typ úložiště</th>
                            <th scope="col">Doba uchování</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <code>accessToken</code>
                            </td>
                            <td>
                                Ověření přihlášeného uživatele při komunikaci
                                se serverem.
                            </td>
                            <td>HTTP cookie (HttpOnly)</td>
                            <td>15&nbsp;minut; při odhlášení se smaže</td>
                        </tr>
                        <tr>
                            <td>
                                <code>refreshToken</code>
                            </td>
                            <td>
                                Obnovení přihlášení bez opětovného zadání
                                hesla.
                            </td>
                            <td>HTTP cookie (HttpOnly)</td>
                            <td>
                                30&nbsp;dní od posledního obnovení přihlášení;
                                při odhlášení se smaže
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <code>auth-storage</code>
                            </td>
                            <td>
                                Údaje profilu přihlášeného uživatele (například
                                jméno, e-mail, telefon a&nbsp;adresa) pro
                                zobrazení účtu a&nbsp;předvyplnění objednávky.
                            </td>
                            <td>localStorage</td>
                            <td>
                                Do odhlášení; poté se údaje profilu
                                z&nbsp;úložiště odstraní
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <code>sushi-cart</code>
                            </td>
                            <td>
                                Obsah košíku (produkty, množství, ceny
                                a&nbsp;restaurace).
                            </td>
                            <td>localStorage</td>
                            <td>
                                Do vyprázdnění košíku, odeslání objednávky
                                nebo smazání dat prohlížeče
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <code>restaurant-storage</code>
                            </td>
                            <td>
                                Naposledy zvolená restaurace (Kolín nebo
                                Jihlava).
                            </td>
                            <td>localStorage</td>
                            <td>Do smazání dat prohlížeče</td>
                        </tr>
                        <tr>
                            <td>
                                <code>theme</code>
                            </td>
                            <td>
                                Vámi zvolený vzhled webu (světlý nebo tmavý).
                            </td>
                            <td>localStorage</td>
                            <td>Do smazání dat prohlížeče</td>
                        </tr>
                    </tbody>
                </LegalTable>
                <p>
                    Cookies <code>accessToken</code> a&nbsp;
                    <code>refreshToken</code> nastavuje server webu pouze po
                    přihlášení k&nbsp;uživatelskému účtu. Jsou označeny jako
                    HttpOnly, takže k&nbsp;nim nemají přístup skripty na
                    stránce.
                </p>
            </section>

            <section id="souhlas">
                <h2>4. Nezbytné technologie a&nbsp;souhlas</h2>
                <p>
                    Podle §&nbsp;89 odst.&nbsp;3 zákona č.&nbsp;127/2005 Sb.,
                    o&nbsp;elektronických komunikacích, se souhlas uživatele
                    nevyžaduje k&nbsp;ukládání údajů, které je nezbytné pro
                    poskytování služby výslovně vyžádané uživatelem. Podle
                    Úřadu pro ochranu osobních údajů platí stejná pravidla
                    i&nbsp;pro místní úložiště prohlížeče a&nbsp;pro web, který
                    používá pouze technicky nezbytné cookies, není lišta se
                    souhlasem s&nbsp;cookies potřebná.
                </p>
                <p>
                    Všechny technologie uvedené v&nbsp;přehledu slouží
                    výhradně k&nbsp;zajištění funkcí, které sami využíváte:
                    přihlášení k&nbsp;účtu, košíku, volbě restaurace
                    a&nbsp;vámi zvolenému vzhledu webu. Web proto k&nbsp;jejich
                    použití nežádá souhlas a&nbsp;nezobrazuje lištu se
                    souhlasem s&nbsp;cookies.
                </p>
            </section>

            <section id="analytika-a-reklama">
                <h2>5. Analytické a&nbsp;reklamní technologie</h2>
                <p>
                    Web nepoužívá analytické, reklamní ani sledovací cookies
                    a&nbsp;nevkládá měřicí ani reklamní skripty třetích stran.
                    Pokud bychom takové technologie v&nbsp;budoucnu začali
                    používat, vyžádáme si k&nbsp;nim předem váš souhlas
                    a&nbsp;tyto zásady aktualizujeme.
                </p>
            </section>

            <section id="sluzby-tretich-stran">
                <h2>6. Služby třetích stran</h2>
                <p>
                    Při vyhledávání adresy a&nbsp;zobrazení mapy na stránce
                    zadání objednávky se váš prohlížeč připojuje ke službám
                    projektu OpenStreetMap (vyhledávání adres Nominatim
                    a&nbsp;mapové podklady). Výchozí obrázek profilu se načítá
                    ze služby DiceBear. Tyto služby při načítání obsahu
                    zpracovávají technické údaje, jako je IP adresa.
                    Podrobnosti najdete na stránce{" "}
                    <Link href={LEGAL_ROUTES.privacy}>
                        Ochrana osobních údajů
                    </Link>
                    .
                </p>
            </section>

            <section id="sprava">
                <h2>7. Jak cookies a&nbsp;uložená data spravovat</h2>
                <p>
                    Cookies a&nbsp;data místního úložiště můžete kdykoli
                    zobrazit nebo smazat v&nbsp;nastavení svého prohlížeče.
                    Odhlášením z&nbsp;uživatelského účtu se přihlašovací cookies
                    smažou a&nbsp;údaje profilu se odstraní z&nbsp;místního
                    úložiště. Po smazání dat budete odhlášeni, obsah košíku se
                    vyprázdní a&nbsp;web se vrátí k&nbsp;výchozímu vzhledu.
                </p>
            </section>

            <section id="zmeny">
                <h2>8. Změny těchto zásad</h2>
                <p>
                    Tyto zásady aktualizujeme při každé změně používaných
                    technologií. Aktuální znění je vždy zveřejněno na této
                    stránce. Tyto zásady nabývají účinnosti dnem jejich
                    zveřejnění na webu.
                </p>
            </section>
        </LegalPage>
    );
}
