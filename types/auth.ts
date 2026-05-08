import type { User } from "./user";

export type LoginPayload = {
    email: string;
    password: string;
};

export type RegisterPayload = {
    name: string;
    email: string;
    password: string;
};

export type RegisterResponse = {
    id: string;
    name: string;
    email: string;
};

export type LoginResponse = {
    message: string;
};

export type AuthResult = {
    user: User;
};
