import api from "@/services/api/api";
import { Profile } from "../types/Profile";

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export async function getProfile(): Promise<Profile> {
    const response = await api.get<ApiResponse<Profile>>("/profile");
    return response.data.data;
}

export async function updateProfile(data: Partial<Profile>): Promise<Profile> {
    const response = await api.put<ApiResponse<Profile>>("/profile", data);
    return response.data.data;
}