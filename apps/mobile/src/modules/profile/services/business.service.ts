import api from "@/services/api/api";

import { Business } from "@/modules/customer/types/Business";

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export async function getMyBusinesses(): Promise<Business[]> {
    const response = await api.get<ApiResponse<Business[]>>("/businesses/my");
    return response.data.data;
}

export async function createBusiness(data: any) {
    const response = await api.post("/businesses", data);
    return response.data.data;
}

export async function updateBusiness(id: number, data: any) {
    const response = await api.put(`/businesses/${id}`, data);
    return response.data.data;
}

export async function deleteBusiness(id: number) {
    await api.delete(`/businesses/${id}`);
}