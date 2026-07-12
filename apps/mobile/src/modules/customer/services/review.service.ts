import api from "@/services/api/api";

export async function createReview(businessId: number, rating: number, comment: string,) {
    const response = await api.post(
        "/reviews",
        { business_id: businessId, rating, comment, }
    );
    return response.data.data;
}

export async function getBusinessReviews(businessId: number,) {
    const response = await api.get( `/businesses/${businessId}` );
    return response.data.data.reviews;
}