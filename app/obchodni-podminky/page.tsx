import type { Metadata } from "next";
import Link from "next/link";

import LegalPage, { OperatorCards } from "@/components/LegalPage/LegalPage";

import {
    DELIVERY_FEE_PER_KM_CZK,
    DELIVERY_MAX_DISTANCE_KM,
    LEGAL_PAGES_NOINDEX,
    LEGAL_ROUTES,
    OPERATOR_LIST,
} from "@/lib/legal";
import {
    BUSINESS_OPEN_MINUTES,
    ORDER_LEAD_MINUTES,
    SLOT_STEP_MINUTES,
    formatMinutes,
} from "@/lib/deliveryTime";
import { RESTAURANT_CLOSE_MINUTES } from "@/lib/restaurants";

export const metadata: Metadata = {
    title: "Obchodní podmínky",
    description:
        "Obchodní podmínky pro objednávání jídel z restaurací SushiMax Kolín a SushiMax Jihlava.",
    robots: LEGAL_PAGES_NOINDEX ? { index: false, follow: true } : undefined,
};

const OPEN_TIME = formatMinutes(BUSINESS_OPEN_MINUTES);

export default function TermsPage() {
    return (
        <LegalPage
            title="Obchodní podmínky"
            lead="Obchodní podmínky pro objednávání jídel s rozvozem nebo osobním odběrem prostřednictvím webu sushimax.cz z restaurací SushiMax Kolín a SushiMax Jihlava."
        >
            <section id="uvod">
                <h2>1. Úvodní ustanovení</h2>
                <p>
                    Tyto obchodní podmínky upravují vzájemná práva
                    a&nbsp;povinnosti mezi provozovatelem restaurace
                    a&nbsp;zákazníkem při objednávání jídel a&nbsp;dalšího
                    zboží prostřednictvím webu sushimax.cz (dále jen „web“).
                </p>
                <p>
                    Prostřednictvím webu lze objednávat ze dvou restaurací
                    značky SushiMax. <strong>Každou restauraci provozuje jiný
                    podnikatel.</strong> Prodávajícím, a&nbsp;tedy smluvní
                    stranou zákazníka, je vždy provozovatel té restaurace, ze
                    které zákazník objednává (dále jen „provozovatel“).
                    Provozovatelé neodpovídají za závazky toho druhého.
                </p>
                <p>
                    Restaurace, ze které zákazník objednává, je uvedena na
                    stránce zadání objednávky (údaj „Restaurace: Kolín“ nebo
                    „Restaurace: Jihlava“). Jedna objednávka může obsahovat
                    pouze položky jedné restaurace.
                </p>
                <p>
                    Zákazníkem, který je spotřebitelem, je každý člověk, který
                    mimo rámec své podnikatelské činnosti nebo samostatného
                    výkonu povolání uzavírá smlouvu s&nbsp;provozovatelem.
                    Práva, která spotřebitelům přiznávají právní předpisy,
                    nejsou těmito obchodními podmínkami dotčena.
                </p>
            </section>

            <section id="provozovatele">
                <h2>2. Identifikace provozovatelů</h2>
                <p>
                    Restauraci SushiMax Kolín a&nbsp;restauraci SushiMax
                    Jihlava provozují tito samostatní podnikatelé:
                </p>
                <OperatorCards />
            </section>

            <section id="nabidka-a-ceny">
                <h2>3. Nabídka produktů a&nbsp;ceny</h2>
                <p>
                    Nabídka jídel a&nbsp;nápojů je uvedena na webu zvlášť pro
                    každou restauraci. Prezentace produktů na webu má
                    informativní charakter a&nbsp;není návrhem provozovatele na
                    uzavření smlouvy. Ustanovení §&nbsp;1732 odst.&nbsp;2
                    občanského zákoníku se nepoužije. Provozovatel může
                    objednávku odmítnout, zejména pokud některý produkt není
                    dostupný.
                </p>
                <p>
                    Všechny ceny jsou uvedeny v&nbsp;korunách českých a&nbsp;jsou
                    konečné, včetně daně z&nbsp;přidané hodnoty. Celkovou cenu
                    objednávky včetně dopravného vypočítá systém provozovatele
                    a&nbsp;zákazník ji vidí v&nbsp;souhrnu objednávky před jejím
                    odesláním. Rozhodující je cena uvedená v&nbsp;souhrnu
                    objednávky v&nbsp;okamžiku jejího odeslání.
                </p>
                <p>
                    Některé kategorie restauračního menu restaurace SushiMax
                    Kolín nelze objednat prostřednictvím webu. U&nbsp;těchto
                    kategorií web uvádí, že je lze objednat pouze telefonicky.
                </p>
                <p>
                    Obsahuje-li nabídka alkoholické nápoje, lze je prodat pouze
                    osobám starším 18&nbsp;let.
                </p>
            </section>

            <section id="alergeny">
                <h2>4. Informace o&nbsp;alergenech</h2>
                <p>
                    Přehled 14 alergenů stanovených nařízením Evropského
                    parlamentu a&nbsp;Rady (EU) č.&nbsp;1169/2011 najdete na
                    stránce <Link href="/alergeny">Seznam alergenů</Link>.
                    Informace o&nbsp;alergenech obsažených v&nbsp;konkrétních
                    pokrmech poskytne zákazníkovi na vyžádání restaurace, ze
                    které objednává, a&nbsp;to telefonicky nebo e-mailem.
                </p>
                <p>
                    Alergie nebo jiná omezení může zákazník uvést
                    v&nbsp;poznámce k&nbsp;objednávce. Poznámka však nenahrazuje
                    dotaz na složení pokrmu. Trpí-li zákazník závažnou
                    alergií, doporučujeme složení pokrmu před objednáním
                    ověřit telefonicky přímo v&nbsp;restauraci.
                </p>
            </section>

            <section id="objednavani">
                <h2>5. Objednávání a&nbsp;uzavření kupní smlouvy</h2>
                <p>Objednávka se na webu činí v&nbsp;těchto krocích:</p>
                <ol>
                    <li>zákazník vybere restauraci,</li>
                    <li>vloží vybrané produkty do košíku,</li>
                    <li>zvolí doručení nebo osobní odběr,</li>
                    <li>
                        vyplní kontaktní údaje (jméno, příjmení, telefon
                        a&nbsp;e-mail), u&nbsp;doručení adresu, dále čas
                        doručení, počet osob a&nbsp;způsob platby; volitelně
                        může doplnit poznámku k&nbsp;objednávce,
                    </li>
                    <li>
                        zkontroluje souhrn objednávky s&nbsp;cenou produktů,
                        dopravným a&nbsp;celkovou cenou,
                    </li>
                    <li>
                        objednávku odešle tlačítkem „Dokončit objednávku“.
                    </li>
                </ol>
                <p>
                    Před odesláním objednávky může zákazník zadané údaje
                    kontrolovat a&nbsp;opravovat, případně se vrátit do košíku
                    a&nbsp;objednávku upravit. Objednávku i&nbsp;smlouvu lze
                    uzavřít v&nbsp;českém jazyce.
                </p>
                <p>
                    Odesláním objednávky zákazník činí návrh na uzavření
                    kupní smlouvy s&nbsp;provozovatelem zvolené restaurace. Odeslání objednávky ani její uložení
                    v&nbsp;systému provozovatele neznamená, že ji restaurace
                    přijala.
                </p>
                <p>
                    <strong>Kupní smlouva je uzavřena okamžikem, kdy
                    restaurace objednávku přijme.</strong> Přijetím objednávky
                    vzniká zákazníkovi povinnost zaplatit kupní cenu při
                    převzetí objednávky.
                </p>
                <p>
                    Uzavřená smlouva (objednávka) je uložena v&nbsp;elektronické
                    podobě v&nbsp;systému provozovatele a&nbsp;není přístupná
                    třetím osobám. Zákazník s&nbsp;uživatelským účtem má
                    přehled svých objednávek k&nbsp;dispozici ve svém profilu.
                </p>
            </section>

            <section id="potvrzeni-objednavky">
                <h2>6. Potvrzení a&nbsp;odmítnutí objednávky</h2>
                <p>
                    Po odeslání objednávky se zákazníkovi na webu zobrazí
                    informace o&nbsp;jejím odeslání. Objednávku následně
                    posoudí pracovníci restaurace, kteří ji v&nbsp;pokladním
                    systému přijmou, nebo odmítnou.
                </p>
                <p>
                    O&nbsp;přijetí nebo odmítnutí objednávky provozovatel
                    zákazníka informuje e-mailem na adresu uvedenou
                    v&nbsp;objednávce. Je-li třeba některé údaje upřesnit,
                    mohou pracovníci restaurace zákazníka kontaktovat
                    telefonicky. Telefonické ověření neprobíhá u&nbsp;každé
                    objednávky.
                </p>
                <p>
                    Doručení e-mailu může ovlivnit například nesprávně zadaná
                    adresa nebo zařazení zprávy mezi nevyžádanou poštu.
                    Neobdrží-li zákazník informaci o&nbsp;přijetí objednávky,
                    doporučujeme kontaktovat restauraci telefonicky.
                </p>
                <p>
                    Provozovatel může objednávku odmítnout. Objednávka, u&nbsp;které
                    pokladní systém nepřijme zadané telefonní číslo, není
                    přijata a&nbsp;nebude připravována. O&nbsp;této skutečnosti
                    provozovatel zákazníka informuje e-mailem.
                </p>
            </section>

            <section id="platba">
                <h2>7. Způsoby platby</h2>
                <p>
                    Kupní cena se platí při převzetí objednávky. Způsob platby
                    zákazník zvolí v&nbsp;objednávce.
                </p>
                <p>
                    <strong>Při rozvozu:</strong>
                </p>
                <ul>
                    <li>platba v&nbsp;hotovosti při doručení,</li>
                    <li>
                        platba kartou při doručení prostřednictvím platebního
                        terminálu kurýra.
                    </li>
                </ul>
                <p>
                    <strong>Při osobním odběru:</strong>
                </p>
                <ul>
                    <li>platba v&nbsp;hotovosti při osobním odběru,</li>
                    <li>
                        platba kartou při osobním odběru prostřednictvím
                        platebního terminálu v&nbsp;restauraci.
                    </li>
                </ul>
                <p>
                    Web neumožňuje platbu online a&nbsp;zákazník na webu
                    nezadává žádné platební údaje. Provozovatel nepožaduje
                    zálohu ani jinou platbu předem.
                </p>
            </section>

            <section id="rozvoz-a-odber">
                <h2>8. Rozvoz a&nbsp;osobní odběr</h2>
                <p>
                    <strong>Doba přijímání objednávek.</strong> Objednávku na
                    co nejdřívější doručení lze odeslat v&nbsp;otevírací době
                    restaurace, v&nbsp;současnosti denně od {OPEN_TIME} do{" "}
                    {formatMinutes(RESTAURANT_CLOSE_MINUTES.kolin)}
                    {" "}v&nbsp;Kolíně a&nbsp;od {OPEN_TIME} do{" "}
                    {formatMinutes(RESTAURANT_CLOSE_MINUTES.jihlava)}
                    {" "}v&nbsp;Jihlavě. Objednávku lze také naplánovat na
                    konkrétní den a&nbsp;čas. Nejbližší možný čas je
                    {" "}{ORDER_LEAD_MINUTES}&nbsp;minut od odeslání
                    objednávky a&nbsp;čas se volí v&nbsp;intervalech po{" "}
                    {SLOT_STEP_MINUTES}&nbsp;minutách.
                </p>
                <p>
                    Zvolený čas doručení nebo vyzvednutí je předpokládaný.
                    Skutečný čas se může lišit, zejména při zvýšeném počtu
                    objednávek nebo v&nbsp;důsledku dopravní situace.
                </p>
                <p>
                    <strong>Rozvoz.</strong> Objednávku doručí kurýr na adresu
                    uvedenou v&nbsp;objednávce. Adresa musí obsahovat ulici
                    a&nbsp;číslo domu. Zákazník by měl být v&nbsp;době doručení
                    k&nbsp;zastižení na uvedeném telefonním čísle.
                </p>
                <ul>
                    <li>
                        Doručení na adresu v&nbsp;rámci administrativní hranice
                        města Kolín (u&nbsp;restaurace SushiMax Kolín) nebo
                        města Jihlava (u&nbsp;restaurace SushiMax Jihlava) je
                        zdarma.
                    </li>
                    <li>
                        Při doručení mimo tuto hranici se účtuje dopravné{" "}
                        {DELIVERY_FEE_PER_KM_CZK}&nbsp;Kč za každý započatý
                        kilometr vzdálenosti po silnici od restaurace.
                    </li>
                    <li>
                        Na adresy vzdálené po silnici více než{" "}
                        {DELIVERY_MAX_DISTANCE_KM}&nbsp;km provozovatel
                        nedoručuje.
                    </li>
                    <li>Minimální hodnota objednávky není stanovena.</li>
                </ul>
                <p>
                    Zda na zvolenou adresu doručujeme a&nbsp;jaká je výše
                    dopravného, zobrazí web při zadání adresy, nejpozději
                    v&nbsp;souhrnu objednávky před jejím odesláním.
                </p>
                <p>
                    <strong>Osobní odběr.</strong> Objednávku si zákazník
                    vyzvedne v&nbsp;provozovně restaurace, ze které
                    objednával. Při osobním odběru se dopravné neúčtuje.
                </p>
                <ul>
                    {OPERATOR_LIST.map((operator) => (
                        <li key={operator.restaurantId}>
                            {operator.restaurantName}:{" "}
                            {operator.restaurantAddress}
                        </li>
                    ))}
                </ul>
            </section>

            <section id="zmeny-a-zruseni">
                <h2>9. Změny a&nbsp;zrušení objednávky</h2>
                <p>
                    Odeslanou objednávku nelze změnit ani zrušit online. Změnu
                    nebo zrušení objednávky je třeba co nejdříve projednat
                    telefonicky s&nbsp;restaurací, ze které zákazník
                    objednával (kontakty viz{" "}
                    <a href="#provozovatele">Identifikace provozovatelů</a>).
                </p>
                <p>
                    Dokud restaurace objednávku nepřijme, může ji zákazník
                    zrušit. Po přijetí objednávky je smlouva uzavřena
                    a&nbsp;restaurace zpravidla začíná s&nbsp;přípravou jídla.
                    Změnu nebo zrušení přijaté objednávky lze proto provést
                    pouze po dohodě s&nbsp;restaurací.
                </p>
            </section>

            <section id="odstoupeni">
                <h2>10. Odstoupení od smlouvy</h2>
                <p>
                    Spotřebitel má obecně právo odstoupit od smlouvy uzavřené
                    prostřednictvím internetu do 14&nbsp;dnů od převzetí zboží.
                    Podle §&nbsp;1837 občanského zákoníku však spotřebitel
                    nemůže odstoupit zejména od smlouvy o&nbsp;dodání zboží,
                    které podléhá rychlé zkáze, a&nbsp;zboží, které bylo
                    upraveno podle jeho přání. Připravená jídla do těchto
                    kategorií spadají, a&nbsp;od smlouvy o&nbsp;jejich dodání
                    proto nelze odstoupit.
                </p>
                <p>
                    Obsahuje-li objednávka zboží, které rychle nepodléhá zkáze
                    a&nbsp;nebylo upraveno podle přání zákazníka (například
                    nápoje v&nbsp;neporušeném originálním balení), může
                    spotřebitel od smlouvy v&nbsp;části týkající se tohoto
                    zboží odstoupit do 14&nbsp;dnů od jeho převzetí.
                    Odstoupení je třeba oznámit provozovateli příslušné
                    restaurace, například e-mailem. Zboží je třeba vrátit
                    nepoškozené, náklady na jeho vrácení nese spotřebitel.
                    Provozovatel vrátí přijaté peněžní prostředky do
                    14&nbsp;dnů od odstoupení od smlouvy stejným způsobem,
                    jakým je přijal, nedohodne-li se se spotřebitelem jinak.
                    Peněžní prostředky nemusí vrátit dříve, než mu spotřebitel
                    zboží předá.
                </p>
            </section>

            <section id="reklamace">
                <h2>11. Reklamace a&nbsp;práva z&nbsp;vadného plnění</h2>
                <p>
                    Provozovatel odpovídá za to, že objednávka při převzetí
                    nemá vady a&nbsp;odpovídá objednávce. Práva z&nbsp;vadného
                    plnění se řídí občanským zákoníkem a&nbsp;zákonem
                    o&nbsp;ochraně spotřebitele.
                </p>
                <p>
                    Vzhledem k&nbsp;povaze připravených jídel doporučujeme
                    objednávku zkontrolovat ihned při převzetí. Zjistí-li
                    zákazník vadu (například chybějící nebo zaměněnou položku
                    či poškozený pokrm), měl by ji oznámit bez zbytečného
                    odkladu, nejlépe ještě při převzetí nebo bezprostředně po
                    něm. Vyřízení usnadní, pokud zákazník vadu popíše
                    a&nbsp;případně doloží fotografií.
                </p>
                <p>
                    Reklamaci lze uplatnit v&nbsp;provozovně restaurace, ze
                    které zákazník objednával, a&nbsp;dále telefonicky nebo
                    e-mailem na kontaktech provozovatele (viz{" "}
                    <a href="#provozovatele">Identifikace provozovatelů</a>).
                    Při uplatnění reklamace provozovatel vydá zákazníkovi
                    písemné potvrzení, ve kterém uvede datum uplatnění
                    reklamace, její obsah, požadovaný způsob vyřízení
                    a&nbsp;kontaktní údaje zákazníka. Potvrzení může zaslat
                    e-mailem.
                </p>
                <p>
                    Reklamace včetně odstranění vady musí být vyřízena
                    a&nbsp;zákazník o&nbsp;tom musí být informován nejpozději do
                    30&nbsp;dnů ode dne uplatnění reklamace, nedohodne-li se
                    provozovatel se zákazníkem na delší lhůtě (§&nbsp;19
                    zákona č.&nbsp;634/1992 Sb., o&nbsp;ochraně spotřebitele).
                </p>
            </section>

            <section id="mimosoudni-reseni-sporu">
                <h2>12. Mimosoudní řešení spotřebitelských sporů</h2>
                <p>
                    Nepodaří-li se spor mezi spotřebitelem a&nbsp;provozovatelem
                    vyřešit vzájemnou dohodou, má spotřebitel právo na
                    mimosoudní řešení spotřebitelského sporu. Věcně příslušným
                    subjektem je Česká obchodní inspekce, internetová adresa:{" "}
                    <a
                        href="https://coi.gov.cz/informace-o-adr/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        coi.gov.cz/informace-o-adr
                    </a>
                    . Návrh na zahájení řízení lze podat nejpozději do
                    1&nbsp;roku ode dne, kdy spotřebitel uplatnil své právo,
                    které je předmětem sporu, u&nbsp;provozovatele poprvé.
                </p>
                <p>
                    Dozor nad dodržováním povinností na ochranu spotřebitele
                    vykonává Česká obchodní inspekce (
                    <a
                        href="https://coi.gov.cz"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        coi.gov.cz
                    </a>
                    ).
                </p>
            </section>

            <section id="osobni-udaje">
                <h2>13. Ochrana osobních údajů</h2>
                <p>
                    Informace o&nbsp;zpracování osobních údajů zákazníků jsou
                    uvedeny na stránce{" "}
                    <Link href={LEGAL_ROUTES.privacy}>
                        Ochrana osobních údajů
                    </Link>
                    . Informace o&nbsp;cookies a&nbsp;dalších technologiích
                    ukládání dat v&nbsp;prohlížeči jsou uvedeny na stránce{" "}
                    <Link href={LEGAL_ROUTES.cookies}>
                        Zásady používání cookies
                    </Link>
                    .
                </p>
            </section>

            <section id="zaverecna-ustanoveni">
                <h2>14. Závěrečná ustanovení</h2>
                <p>
                    Právní vztahy mezi provozovatelem a&nbsp;zákazníkem se řídí
                    právním řádem České republiky, zejména zákonem
                    č.&nbsp;89/2012 Sb., občanský zákoník, a&nbsp;zákonem
                    č.&nbsp;634/1992 Sb., o&nbsp;ochraně spotřebitele.
                </p>
                <p>
                    Provozovatelé mohou tyto obchodní podmínky měnit. Na
                    objednávku se vztahuje znění obchodních podmínek účinné
                    v&nbsp;okamžiku jejího odeslání.
                </p>
                <p>
                    Tyto obchodní podmínky nabývají účinnosti dnem jejich
                    zveřejnění na webu.
                </p>
            </section>
        </LegalPage>
    );
}
