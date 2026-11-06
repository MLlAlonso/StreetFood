
import { updateLiveLocation } from "./location.service";
import type { Coordinates } from "../types/LiveLocation";

const trackingSessions = new Map<number, number>();

export function startWebLiveTracking( businessId: number, onError?: (error: string) => void): Promise<void> {
    if (!navigator.geolocation) {
        return Promise.reject( new Error("GEOLOCATION_NOT_SUPPORTED") );
    }

    if (trackingSessions.has(businessId)) {
        return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
        let initialized = false;

        const watchId = navigator.geolocation.watchPosition(
            async (position) => {
                const coordinates: Coordinates = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                };

                try {
                    if (!initialized) {
                        const { startLiveLocation } = await import( "./location.service" );
                        await startLiveLocation(businessId, coordinates);
                        initialized = true;
                        trackingSessions.set(businessId, watchId);
                        resolve();
                        return;
                    }

                    await updateLiveLocation(businessId, coordinates);
                } catch (error) {
                    if (!initialized) {
                        navigator.geolocation.clearWatch(watchId);
                        reject(error);
                    } else {
                        onError?.("LIVE_LOCATION_UPDATE_FAILED");
                    }
                }
            },
            (error) => {
                navigator.geolocation.clearWatch(watchId);

                const messages: Record<number, string> = {
                    1: "LOCATION_PERMISSION_DENIED",
                    2: "LOCATION_UNAVAILABLE",
                    3: "LOCATION_TIMEOUT",
                };

                const message = messages[error.code] ?? "LIVE_LOCATION_START_FAILED";

                if (!initialized) {
                    reject(new Error(message));
                } else {
                    onError?.(message);
                }
            },
            {
                enableHighAccuracy: true,
                maximumAge: 0,
                timeout: 15000,
            }
        );
    });
}

export async function stopWebLiveTracking( businessId: number): Promise<void> {
    const watchId = trackingSessions.get(businessId);

    if (watchId !== undefined) {
        navigator.geolocation.clearWatch(watchId);
        trackingSessions.delete(businessId);
    }

    const { stopLiveLocation } = await import("./location.service");
    await stopLiveLocation(businessId);
}