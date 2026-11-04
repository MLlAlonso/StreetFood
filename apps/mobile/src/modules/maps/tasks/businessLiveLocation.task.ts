import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";

import { getActiveTrackingBusinessIds, saveActiveTrackingBusinessIds, } from "../services/businessLiveTracking.storage";
import { updateLiveLocation } from "../services/location.service";

export const BUSINESS_LIVE_LOCATION_TASK = "BUSINESS_LIVE_LOCATION_TASK";
let processing = false;

TaskManager.defineTask(
    BUSINESS_LIVE_LOCATION_TASK,
    async ({ data, error }) => {
        if (error || processing) return;
        const locations = (data as { locations?: Location.LocationObject[] } | undefined)?.locations;
        if (!locations?.length) return;
        const lastLocation = locations[locations.length - 1];
        const coordinates = { latitude: lastLocation.coords.latitude, longitude: lastLocation.coords.longitude, };
        processing = true;

        try {
            let businessIds = await getActiveTrackingBusinessIds();

            for (const businessId of businessIds) {
                try {
                    await updateLiveLocation(businessId, coordinates);
                } catch (exception: any) {
                    const status = exception?.response?.status;

                    // El backend informa que el seguimiento de este negocio ya fue desactivado.
                    if (status === 409 || status === 404) {
                        businessIds = businessIds.filter((id) => id !== businessId);
                        await saveActiveTrackingBusinessIds(businessIds);
                    }
                }
            }

            // Si todos los negocios fueron desactivados,
            // detener la tarea GPS.
            if (businessIds.length === 0) {
                const started = await Location.hasStartedLocationUpdatesAsync(BUSINESS_LIVE_LOCATION_TASK);

                if (started) {
                    await Location.stopLocationUpdatesAsync(BUSINESS_LIVE_LOCATION_TASK);
                }
            }
        } finally {
            processing = false;
        }
    }
);