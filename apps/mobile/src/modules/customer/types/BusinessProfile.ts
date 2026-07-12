import { Review } from "./Review";

export interface BusinessProfile {
    id: number;
    business_name: string;
    business_type: "restaurant" | "food_truck";
    logo: string;
    image: string;
    description: string;
    latitude: number | null;
    longitude: number | null;
    rating: number;
    reviews_count: number;
    reviews: Review[];
    distance: number;

    owner: {
        id: number;
        name: string;
        email: string;
        phone: string | null;
        language: string;
        avatar: string | null;
    };

    categories: string[];

    menu: {
        id: number;
        name: string;
        description: string;
        image: string;
    }[];
}