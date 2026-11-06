import { useCallback, useEffect, useState } from "react";
import { AppState, Platform } from "react-native";
import { getLiveLocation } from "../services/location.service";
import { startBusinessLiveTracking, stopBusinessLiveTracking, } from "../services/businessLiveTracking.service";

export function useBusinessLiveTracking(businessId: number) {
    const [active, setActive] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const refresh = useCallback(async () => {
        if (!businessId) return;

        try {
            const location = await getLiveLocation(businessId);
            setActive(location.active);
            setError(null);
        } catch {
            setError("LIVE_LOCATION_STATUS_FAILED");
        }
    }, [businessId]);

    useEffect(() => {
        void refresh();

        const subscription = AppState.addEventListener(
            "change",
            (state) => {
                if (state === "active") {
                    void refresh();
                }
            }
        );

        return () => subscription.remove();
    }, [refresh]);

    const start = useCallback(async () => {
        if (loading || active) return;

        setLoading(true);
        setError(null);

        try {
            await startBusinessLiveTracking(businessId);
            setActive(true);
        } catch (exception) {
            const message = exception instanceof Error ? exception.message : "LIVE_LOCATION_START_FAILED";
            setError(message);
            throw exception;
        } finally {
            setLoading(false);
        }
    }, [businessId, loading, active]);

    const stop = useCallback(async () => {
        if (loading || !active) return;
        setLoading(true);
        setError(null);

        try {
            await stopBusinessLiveTracking(businessId);
            setActive(false);
        } catch (exception) {
            const message = exception instanceof Error ? exception.message : "LIVE_LOCATION_STOP_FAILED";
            setError(message);
            throw exception;
        } finally {
            setLoading(false);
        }
    }, [businessId, loading, active]);

    return { active, loading, error, start, stop, refresh, };
}