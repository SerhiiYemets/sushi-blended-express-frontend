import { z } from "zod";

const emailField = z
    .string()
    .trim()
    .min(1, "Toto pole je povinné")
    .pipe(z.email("Zadejte platný e-mail"));

const passwordField = z
    .string()
    .min(8, "Heslo musí mít alespoň 8 znaků")
    .max(40, "Heslo může mít maximálně 40 znaků");

export const signUpSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Jméno musí mít alespoň 2 znaky")
        .max(20, "Jméno může mít maximálně 20 znaků"),
    email: emailField,
    password: passwordField,
});

export const signInSchema = z.object({
    email: emailField,
    password: passwordField,
});

export type SignInValues = z.infer<typeof signInSchema>;
export type SignUpValues = z.infer<typeof signUpSchema>;
