import api from "@/services/api/api";

export async function getBusiness( id: number) {
    const response = await api.get( `/businesses/${id}` );
    return response.data.data;
}