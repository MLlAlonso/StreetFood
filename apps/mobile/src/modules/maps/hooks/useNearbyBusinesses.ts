import { useCallback, useState } from "react";
import { getNearbyBusinesses, } from "../services/location.service";
import { getCurrentCoordinates, } from "../services/deviceLocation.service";
import type { Coordinates, NearbyBusiness, } from "../types/LiveLocation";

export function useNearbyBusinesses() {
    const [businesses, setBusinesses] = useState<NearbyBusiness[]>([]);
    const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const reload = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const current = await getCurrentCoordinates();
            setCoordinates(current);
            const result = await getNearbyBusinesses(current, 10, 50);
            setBusinesses(result.businesses);
        } catch (exception) {
            const message = exception instanceof Error ? exception.message : "NEARBY_BUSINESSES_FAILED";
            setError(message);
        } finally {
            setLoading(false);
        }
    }, []);

    return { businesses, coordinates, loading, error, reload, };
}