import { Platform } from "react-native";
import * as Location from "expo-location";
import type { Coordinates } from "../types/LiveLocation";

export async function getCurrentCoordinates(): Promise<Coordinates> {
    if (Platform.OS === "web") {
        if (typeof navigator === "undefined" || !navigator.geolocation) {
            throw new Error("LOCATION_UNAVAILABLE");
        }

        return new Promise<Coordinates>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                },
                (error) => {
                    if (error.code === 1) {
                        reject(new Error("LOCATION_PERMISSION_DENIED"));
                        return;
                    }

                    if (error.code === 2) {
                        reject(new Error("LOCATION_UNAVAILABLE"));
                        return;
                    }

                    if (error.code === 3) {
                        reject(new Error("LOCATION_TIMEOUT"));
                        return;
                    }

                    reject(new Error("LOCATION_FAILED"));
                },
                {
                    enableHighAccuracy: true,
                    timeout: 25000,
                    maximumAge: 0,
                }
            );
        });
    }

    const permission = await Location.requestForegroundPermissionsAsync();

    if (permission.status !== "granted") {
        throw new Error("LOCATION_PERMISSION_DENIED");
    }

    const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
    });

    return {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
    };
}