import api from "@/services/api/api";

export async function getBusiness(id: number) {
    const response = await api.get(`/businesses/${id}`);
    return response.data.data;
}

export async function getBusinessReviews(id: number, page = 1,) {
    const response = await api.get(`/businesses/${id}/reviews?page=${page}`);
    return response.data;
}