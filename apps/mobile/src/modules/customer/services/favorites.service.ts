import api from "@/services/api/api";
import { Business } from "../types/Business";

export async function getFavorites(): Promise<Business[]> {
    try {
        const response = await api.get("/favorites");
        return response.data.data;
    } catch (error: any) {
        if (error.response?.status === 401) {
            return [];
        }
        throw error;
    }
}

export async function addFavorite(businessId: number) {
    await api.post(`/favorites/${businessId}`);
}

export async function removeFavorite(businessId: number) {
    await api.delete(`/favorites/${businessId}`);
}

export async function getFavoriteStatus(businessId: number): Promise<boolean> {
    try {
        const response = await api.get(
            `/favorites/${businessId}/status`
        );
        return response.data.data.favorite;
    } catch {
        return false;
    }
}