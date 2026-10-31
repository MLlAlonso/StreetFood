import api from "@/services/api/api";

export interface ReverseGeocodeResponse {
    success: boolean;
    data: { formatted_address: string; };
}

export async function reverseGeocodeLocation(latitude: number, longitude: number): Promise<string> {
    const response = await api.get<ReverseGeocodeResponse>("/businesses/reverse-geocode", { params: { latitude, longitude, }, });
    return response.data.data.formatted_address;
}