export interface Profile {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    avatar: string | null;
    language: "en" | "es";
    role: "customer" | "vendor";
}