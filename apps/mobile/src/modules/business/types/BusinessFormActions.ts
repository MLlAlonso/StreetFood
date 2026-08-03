import { MenuItem } from "@/modules/auth/types/MenuItem";
import { BusinessHour } from "./BusinessHour";
import { BusinessSocialLink } from "./BusinessSocialLink";

export interface BusinessFormActions {
    setBusinessType(value: "food_truck" | "restaurant"): void;
    setForm(value: any): void;
    toggleCategory(category: string): void;
    handleLocation(): void;
    handlePickLogo(): void;
    setLogo(value: string | null): void;
    setShowMenuModal(value: boolean): void;
    setSelectedDish(dish: MenuItem | null): void;
    handleAddDish(dish: Omit<MenuItem, "id">): void;
    handleUpdateDish(dish: MenuItem): void;
    setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
    setScheduleEnabled(value: boolean): void;
    setHours: React.Dispatch<React.SetStateAction<BusinessHour[]>>;
    setSocialLinks: React.Dispatch<React.SetStateAction<BusinessSocialLink[]>>;
}