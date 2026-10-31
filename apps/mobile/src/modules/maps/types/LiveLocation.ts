export interface Coordinates { latitude: number; longitude: number;}

export interface NearbyBusiness {
    id: number;
    business_name: string;
    business_type: string;
    logo: string | null;
    image: string | null;
    categories: string[];
    latitude: number;
    longitude: number;
    distance: number;
    rating: number;
    reviews_count: number;
    status: string;
    status_reason?: string;
    opens_at?: string | null;
    closes_at?: string | null;
    live_location_enabled: boolean;
}

export interface LiveLocationResponse {
    business_id: number;
    active: boolean;
    available: boolean;
    latitude: number | null;
    longitude: number | null;
    updated_at: string | null;
}