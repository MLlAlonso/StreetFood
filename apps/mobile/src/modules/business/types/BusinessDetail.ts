import { MenuItem } from "@/modules/auth/types/MenuItem";

export interface BusinessDetail {
    id: number;
    business_name: string;
    business_type: "food_truck" | "restaurant";
    description: string;
    logo: string | null;
    categories: string[];
    latitude: number;
    longitude: number;
    menu: MenuItem[];
    status: "open" | "closed";
    status_reason: "manual" | "schedule";
    opens_at: string | null;
    closes_at: string | null;
    schedule_enabled: boolean;
    hours: {
        day_of_week: number;
        enabled: boolean;
        open_time: string | null;
        close_time: string | null;
    }[];
}