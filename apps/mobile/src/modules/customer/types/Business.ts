export interface Business {
    id: number;
    business_name: string;
    business_type: "food_truck" | "restaurant";
    logo: string;
    categories: string[];
    rating: number;
    distance: number;
}