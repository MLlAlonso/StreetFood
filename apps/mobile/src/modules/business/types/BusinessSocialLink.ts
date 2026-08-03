export type BusinessSocialType =
    | "website"
    | "instagram"
    | "whatsapp"
    | "uber_eats"
    | "rappi"
    | "didi_food"
    | "facebook";

export interface BusinessSocialLink {
    type: BusinessSocialType;
    url: string;
}