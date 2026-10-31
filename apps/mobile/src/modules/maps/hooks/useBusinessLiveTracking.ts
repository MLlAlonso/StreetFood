
import { useCallback, useEffect, useRef, useState } from "react";
import * as Location from "expo-location";

import { startLiveLocation, stopLiveLocation, updateLiveLocation, } from "../services/location.service";
import type { Coordinates } from "../types/LiveLocation";

export function useBusinessLiveTracking(businessId: number) {
    const subscription = useRef<Location.LocationSubscription | null>(null);
    const sending = useRef(false);
    const [active, setActive] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const sendCoordinates = useCallback(
        async (coordinates: Coordinates) => {
            if (sending.current) return;
            sending.current = true;

            try {
                await updateLiveLocation(businessId, coordinates);
            } catch {
                setError("LIVE_LOCATION_UPDATE_FAILED");
            } finally {
                sending.current = false;
            }
        },
        [businessId]
    );

    const stop = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            subscription.current?.remove();
            subscription.current = null;
            await stopLiveLocation(businessId);
            setActive(false);
        } catch {
            setError("LIVE_LOCATION_STOP_FAILED");
        } finally {
            setLoading(false);
        }
    }, [businessId]);

    const start = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const permission = await Location.requestForegroundPermissionsAsync();

            if (permission.status !== "granted") {
                throw new Error("LOCATION_PERMISSION_DENIED");
            }

            const firstPosition = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced, });

            const firstCoordinates: Coordinates = {
                latitude: firstPosition.coords.latitude,
                longitude: firstPosition.coords.longitude,
            };

            await startLiveLocation(businessId, firstCoordinates);
            subscription.current?.remove();
            subscription.current = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.Balanced,
                    timeInterval: 10_000,
                    distanceInterval: 20,
                },
                (position) => {
                    void sendCoordinates({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                }
            );

            setActive(true);
        } catch (exception) {
            const message = exception instanceof Error ? exception.message : "LIVE_LOCATION_START_FAILED";
            setError(message);
            subscription.current?.remove();
            subscription.current = null;
        } finally {
            setLoading(false);
        }
    }, [businessId, sendCoordinates]);

    useEffect(() => {
        return () => {
            subscription.current?.remove();
            subscription.current = null;
        };
    }, []);

    return { active, loading, error, start, stop, };
}