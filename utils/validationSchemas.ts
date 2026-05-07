import * as Yup from "yup";

export const signUpSchema = Yup.object().shape({
    name: Yup.string()
        .min(2, "Jméno musí mít alespoň 2 znaky")
        .max(20, "Jméno může mít maximálně 20 znaků")
        .required("Toto pole je povinné"),

    email: Yup.string()
        .email("Zadejte platný e-mail")
        .required("Toto pole je povinné"),

    password: Yup.string()
        .min(8, "Heslo musí mít alespoň 8 znaků")
        .max(40, "Heslo může mít maximálně 40 znaků")
        .required("Toto pole je povinné"),
});

export const signInSchema = Yup.object({
    email: Yup.string()
        .email("Zadejte platný e-mail")
        .required("Toto pole je povinné"),

    password: Yup.string()
        .min(8, "Heslo musí mít alespoň 8 znaků")
        .max(40, "Heslo může mít maximálně 40 znaků")
        .required("Toto pole je povinné"),
});

