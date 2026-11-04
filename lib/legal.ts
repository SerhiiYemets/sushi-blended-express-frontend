import type { RestaurantId } from "@/lib/restaurants";

export const LEGAL_PAGES_NOINDEX = true;

export const LEGAL_ROUTES = {
    terms: "/obchodni-podminky",
    privacy: "/ochrana-osobnich-udaju",
    cookies: "/zasady-cookies",
} as const;

export type RestaurantOperator = {
    restaurantId: RestaurantId;
    restaurantName: string;
    operatorName: string;
    legalForm: string;
    ico: string;
    dic: string | null;
    registeredOffice: string;
    registration: string | null;
    restaurantAddress: string;
    email: string;
    phone: string;
    phoneHref: string;
};

export const RESTAURANT_OPERATORS: Record<RestaurantId, RestaurantOperator> = {
    kolin: {
        restaurantId: "kolin",
        restaurantName: "SushiMax Kolín",
        operatorName: "Maksym Bondarchuk",
        legalForm: "fyzická osoba podnikající",
        ico: "19143257",
        dic: "CZ685916568",
        registeredOffice: "Koudelov 43, 286 01 Vrdy",
        registration: null,
        restaurantAddress: "Karlovo náměstí 72, 280 02 Kolín",
        email: "sushi.max.cz@gmail.com",
        phone: "+420 721 479 332",
        phoneHref: "tel:+420721479332",
    },
    jihlava: {
        restaurantId: "jihlava",
        restaurantName: "SushiMax Jihlava",
        operatorName: "Beletskaya Oksana",
        legalForm: "společnost s ručením omezeným",
        ico: "21287830",
        dic: "CZ21287830",
        registeredOffice: "Zámecká 82, Kolín I, 280 02 Kolín",
        registration:
            "zapsaná v obchodním rejstříku vedeném Městským soudem v Praze, spisová značka C 399554",
        restaurantAddress: "Úzká 635/1, 586 01 Jihlava",
        email: "beletskaya.oksana03@gmail.com",
        phone: "+420 777 499 970",
        phoneHref: "tel:+420777499970",
    },
};

export const OPERATOR_LIST: readonly RestaurantOperator[] = [
    RESTAURANT_OPERATORS.kolin,
    RESTAURANT_OPERATORS.jihlava,
];

export const DELIVERY_FEE_PER_KM_CZK = 10;
export const DELIVERY_MAX_DISTANCE_KM = 40;
