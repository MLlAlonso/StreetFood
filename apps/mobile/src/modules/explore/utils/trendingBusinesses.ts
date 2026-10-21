import { Business } from "@/modules/customer/types/Business";

type BusinessRatingData = {
    rating?: number | string | null;
    average_rating?: number | string | null;
    averageRating?: number | string | null;
    avg_rating?: number | string | null;
    reviews_count?: number | string | null;
    reviewsCount?: number | string | null;
    review_count?: number | string | null;
    total_reviews?: number | string | null;
    totalReviews?: number | string | null;
    num_reviews?: number | string | null;
    reviews?: unknown[] | null;
};

type RatedBusiness = { business: Business; rating: number; reviewCount: number; score: number; };

function getNumericValue(value: unknown): number {
    if (value === null || value === undefined || value === "") {
        return 0;
    }

    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
}

function getRatingData(business: Business) {
    const item = business as unknown as BusinessRatingData;

    const rating = getNumericValue(
        item.rating ??
        item.average_rating ??
        item.averageRating ??
        item.avg_rating
    );

    const reviewCount = getNumericValue(
        item.reviews_count ??
        item.reviewsCount ??
        item.review_count ??
        item.total_reviews ??
        item.totalReviews ??
        item.num_reviews ??
        item.reviews?.length
    );

    return {
        rating: Math.min(5, Math.max(0, rating)),
        reviewCount: Math.max(0, reviewCount),
    };
}

export function rankTrendingBusinesses(businesses: Business[]): Business[] {
    if (businesses.length === 0) {
        return [];
    }

    const ratedBusinesses = businesses.map((business) => ({ business, ...getRatingData(business), }));

    // Calcular el promedio global utilizando las reseñas disponibles.
    const reviewedBusinesses = ratedBusinesses.filter((item) => item.reviewCount > 0 && item.rating > 0);
    const totalReviews = reviewedBusinesses.reduce((total, item) => total + item.reviewCount, 0);
    const globalAverage = totalReviews > 0 ? reviewedBusinesses.reduce((total, item) => total + item.rating * item.reviewCount, 0) / totalReviews : 0;

    // Peso de referencia para moderar negocios con pocas reseñas.
    const minimumReviews = 5;

    const rankedBusinesses: RatedBusiness[] = ratedBusinesses.map(
        (item) => {
            // Si no hay reseñas, no inventamos una calificación.
            // El negocio sigue participando en el ranking.
            const score = item.reviewCount > 0
                ? (
                    (item.reviewCount / (item.reviewCount + minimumReviews)) * item.rating
                ) + (
                    (minimumReviews / (item.reviewCount + minimumReviews)) * globalAverage
                )
                : item.rating;

            return {
                business: item.business,
                rating: item.rating,
                reviewCount: item.reviewCount,
                score,
            };
        }
    );

    return rankedBusinesses
        .sort((a, b) =>
            b.score - a.score ||
            b.rating - a.rating ||
            b.reviewCount - a.reviewCount ||
            a.business.business_name.localeCompare(b.business.business_name)
        )
        .map((item) => item.business);
}