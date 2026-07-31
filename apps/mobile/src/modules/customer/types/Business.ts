export interface Business {
    id: number;
    business_name: string;
    business_type: "food_truck" | "restaurant";
    logo: string;
    image: string;
    categories: string[];
    rating: number;
    distance: number;
    reviews_count?: number;
    favorites_count?: number;
    menu_items_count?: number;
    status: "open" | "closed";
    status_reason: "manual" | "schedule";
    opens_at: string | null;
    closes_at: string | null;
}