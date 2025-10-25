export interface User {
    id: string;
    displayName: string;
    email: string;
    token: string;
    imageUrl?: string;
}

export interface LoginCreds {
    email: string;
    password: string;
}

export interface RegisterCreds extends LoginCreds {
    displayName: string;
}