import type { Business } from "@/modules/customer/types/Business";
import type { NearbyBusiness } from "@/modules/maps/types/LiveLocation";

export function mapNearbyBusinesses(businesses: NearbyBusiness[]): Business[] {
    return businesses
        .map((business) => ({
            id: business.id,
            business_name: business.business_name,
            business_type: business.business_type as Business["business_type"],
            logo: business.logo ?? "",
            image: business.image ?? "",
            categories: business.categories ?? [],
            rating: business.rating ?? 0,
            reviews_count: business.reviews_count ?? 0,
            status: business.status as Business["status"],
            status_reason: (business.status_reason ?? "schedule") as Business["status_reason"],
            opens_at: business.opens_at ?? null,
            closes_at: business.closes_at ?? null,
            latitude: business.latitude,
            longitude: business.longitude,
            distance: business.distance,
            live_location_enabled: business.live_location_enabled,
        }))
        .sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity));
}