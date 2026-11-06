import { Platform } from "react-native";
import * as Location from "expo-location";
import { startLiveLocation, stopLiveLocation, } from "./location.service";
import { addActiveTrackingBusiness, getActiveTrackingBusinessIds, removeActiveTrackingBusiness, } from "./businessLiveTracking.storage";
import { BUSINESS_LIVE_LOCATION_TASK, } from "../tasks/businessLiveLocation.task";
import { startWebLiveTracking, stopWebLiveTracking,} from "./businessLiveTracking.web";

function ensureNativePlatform() {
    if (Platform.OS === "web") {
        throw new Error("BACKGROUND_LOCATION_NOT_SUPPORTED_ON_WEB");
    }
}

async function requestTrackingPermissions() {
    const foreground = await Location.requestForegroundPermissionsAsync();

    if (foreground.status !== "granted") {
        throw new Error("LOCATION_PERMISSION_DENIED");
    }

    const background = await Location.requestBackgroundPermissionsAsync();

    if (background.status !== "granted") {
        throw new Error("BACKGROUND_LOCATION_PERMISSION_DENIED");
    }
}

async function ensureLocationTaskStarted() {
    const started = await Location.hasStartedLocationUpdatesAsync(BUSINESS_LIVE_LOCATION_TASK);
    if (started) return;

    await Location.startLocationUpdatesAsync(
        BUSINESS_LIVE_LOCATION_TASK,
        {
            accuracy: Location.Accuracy.High,
            timeInterval: 10_000,
            distanceInterval: 20,
            pausesUpdatesAutomatically: false,
            activityType: Location.ActivityType.AutomotiveNavigation,
            showsBackgroundLocationIndicator: true,

            foregroundService: {
                notificationTitle: "Ubicación en vivo activa",
                notificationBody: "Buska está compartiendo la ubicación de tu negocio.",
                notificationColor: "#09233E",
            },
        }
    );
}

export async function startBusinessLiveTracking(businessId: number) {
    if (Platform.OS === "web") {
        await startWebLiveTracking(businessId);
        return;
    }

    await requestTrackingPermissions();
    const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High, });

    const coordinates = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
    };

    await startLiveLocation(businessId, coordinates);

    try {
        await addActiveTrackingBusiness(businessId);
        await ensureLocationTaskStarted();
    } catch (error) {
        await removeActiveTrackingBusiness(businessId);
        await stopLiveLocation(businessId);
        throw error;
    }
}

export async function stopBusinessLiveTracking(businessId: number) {
    if (Platform.OS === "web") {
        await stopWebLiveTracking(businessId);
        return;
    }

    await stopLiveLocation(businessId);
    await removeActiveTrackingBusiness(businessId);
    const remainingIds = await getActiveTrackingBusinessIds();

    if (remainingIds.length === 0) {
        const started = await Location.hasStartedLocationUpdatesAsync( BUSINESS_LIVE_LOCATION_TASK );

        if (started) {
            await Location.stopLocationUpdatesAsync(
                BUSINESS_LIVE_LOCATION_TASK
            );
        }
    }
}