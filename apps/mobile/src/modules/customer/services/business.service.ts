import api from "@/services/api/api";

export async function getBusinesses() {
    const response = await api.get( "/businesses" );

    return response.data.data;
}