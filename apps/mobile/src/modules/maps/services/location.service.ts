import api from "@/services/api/api";

import type { Coordinates, NearbyBusiness, LiveLocationResponse, } from "../types/LiveLocation";
interface ApiResponse<T> { success: boolean; message: string; data: T; }

export interface NearbyResponse {
    origin: Coordinates;
    radius_km: number;
    count: number;
    businesses: NearbyBusiness[];
}

export async function getNearbyBusinesses(coordinates: Coordinates, radiusKm = 100, limit = 20): Promise<NearbyResponse> {
    const response = await api.get<ApiResponse<NearbyResponse>>("/businesses/nearby", {
        params: {
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
            radius_km: radiusKm,
            limit,
        },
    });

    return response.data.data;
}

export async function getLiveLocation(businessId: number): Promise<LiveLocationResponse> {
    const response = await api.get<ApiResponse<LiveLocationResponse>>(`/businesses/${businessId}/live-location`);
    return response.data.data;
}

export async function startLiveLocation(businessId: number, coordinates: Coordinates): Promise<LiveLocationResponse> {
    const response = await api.post<ApiResponse<LiveLocationResponse>>(`/businesses/${businessId}/live-location`, coordinates);
    return response.data.data;
}

export async function updateLiveLocation(businessId: number, coordinates: Coordinates): Promise<LiveLocationResponse> {
    const response = await api.put<ApiResponse<LiveLocationResponse>>(`/businesses/${businessId}/live-location`, coordinates);
    return response.data.data;
}

export async function stopLiveLocation(businessId: number): Promise<void> {
    await api.delete(`/businesses/${businessId}/live-location`);
}

export interface BusinessDirections {
    business_id: number;
    destination_type: "live" | "permanent";
    origin: Coordinates;
    destination: Coordinates;
    distance_meters: number | null;
    duration: string | null;
    encoded_polyline: string;
}

export async function getBusinessDirections(businessId: number, origin: Coordinates): Promise<BusinessDirections> {
    const response = await api.get<ApiResponse<BusinessDirections>>(`/businesses/${businessId}/directions`, {
        params: {
            origin_latitude: origin.latitude,
            origin_longitude: origin.longitude,
        },
    }
    );

    return response.data.data;
}