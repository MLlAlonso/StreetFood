import { MenuItem } from "@/modules/auth/types/MenuItem";
import { BusinessHour } from "./BusinessHour";

export interface BusinessFormData {
    business_name: string;
    description: string;
    business_type: "food_truck" | "restaurant";
    logo: string | null;
    categories: string[];
    location: { latitude: number; longitude: number; } | null;
    menuItems: MenuItem[];
    scheduleEnabled: boolean;
    hours: BusinessHour[];
}