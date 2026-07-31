import { MenuItem } from "@/modules/auth/types/MenuItem";
import { BusinessHour } from "./BusinessHour";

export interface BusinessFormState {
    businessType: "food_truck" | "restaurant";
    form: { business_name: string; description: string; };
    location: { latitude: number; longitude: number; } | null;
    logo: string | null;
    categories: string[];
    menuItems: MenuItem[];
    selectedDish: MenuItem | null;
    showMenuModal: boolean;
    scheduleEnabled: boolean;
    hours: BusinessHour[];
}