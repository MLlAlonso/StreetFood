
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import * as Location from "expo-location";
import MapPickerPlatform from "./MapPickerPlatform";

export interface MapCoordinates {
    latitude: number;
    longitude: number;
}

interface MapPickerModalProps {
    visible: boolean;
    initialLocation: MapCoordinates | null;
    onClose: () => void;
    onSelect: (location: MapCoordinates) => void;
}

// Ubicación de respaldo para visualizar el mapa.
// NO representa la ubicación GPS del usuario.
const DEFAULT_LOCATION: MapCoordinates = {
    latitude: 19.4326,
    longitude: -99.1332,
};

export default function MapPickerModal({
    visible,
    initialLocation,
    onClose,
    onSelect,
}: MapPickerModalProps) {
    const [currentLocation, setCurrentLocation] =
        useState<MapCoordinates | null>(null);

    const [selectedLocation, setSelectedLocation] =
        useState<MapCoordinates | null>(initialLocation);

    const [loadingLocation, setLoadingLocation] = useState(false);
    const [locationError, setLocationError] = useState<string | null>(null);

    useEffect(() => {
        if (!visible) return;

        let mounted = true;

        async function loadLocation() {
            setLoadingLocation(true);
            setLocationError(null);

            try {
                let current: MapCoordinates;

                if (Platform.OS === "web") {
                    // Geolocalización directa del navegador.
                    current = await new Promise<MapCoordinates>(
                        (resolve, reject) => {
                            if (!navigator.geolocation) {
                                reject(
                                    new Error(
                                        "La geolocalización no está disponible en este navegador."
                                    )
                                );
                                return;
                            }

                            navigator.geolocation.getCurrentPosition(
                                (position) => {
                                    resolve({
                                        latitude: position.coords.latitude,
                                        longitude: position.coords.longitude,
                                    });
                                },
                                (error) => {
                                    reject(error);
                                },
                                {
                                    enableHighAccuracy: true,
                                    timeout: 25000,
                                    maximumAge: 0,
                                }
                            );
                        }
                    );
                } else {
                    // Geolocalización nativa para Android e iOS.
                    const permission =
                        await Location.requestForegroundPermissionsAsync();

                    if (permission.status !== "granted") {
                        throw new Error("LOCATION_PERMISSION_DENIED");
                    }

                    const position =
                        await Location.getCurrentPositionAsync({
                            accuracy: Location.Accuracy.High,
                        });

                    current = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    };
                }

                if (!mounted) return;

                setCurrentLocation(current);

                // En creación se utiliza la ubicación actual como selección inicial.
                // En edición se mantiene la ubicación registrada del negocio.
                if (!initialLocation) {
                    setSelectedLocation(current);
                }
            } catch (error: any) {
                console.warn(
                    "Could not retrieve current location:",
                    error
                );

                if (!mounted) return;

                if (Platform.OS === "web") {
                    switch (error?.code) {
                        case 1:
                            setLocationError(
                                "No se concedió permiso para acceder a tu ubicación. Puedes seleccionar el punto manualmente."
                            );
                            break;

                        case 2:
                            setLocationError(
                                "El navegador no pudo determinar tu ubicación. Puedes seleccionar el punto manualmente."
                            );
                            break;

                        case 3:
                            setLocationError(
                                "Se agotó el tiempo para obtener tu ubicación. Puedes seleccionar el punto manualmente."
                            );
                            break;

                        default:
                            setLocationError(
                                "No fue posible obtener tu ubicación. Puedes seleccionar el punto manualmente."
                            );
                    }
                } else {
                    setLocationError(
                        "No fue posible obtener tu ubicación. Puedes seleccionar el punto manualmente."
                    );
                }
            } finally {
                if (mounted) {
                    setLoadingLocation(false);
                }
            }
        }

        setSelectedLocation(initialLocation);
        setCurrentLocation(null);

        loadLocation();

        return () => {
            mounted = false;
        };
    }, [
        visible,
        initialLocation?.latitude,
        initialLocation?.longitude,
    ]);

    const handleConfirm = () => {
        if (!selectedLocation) return;

        onSelect(selectedLocation);
    };

    const initialMapLocation =
        selectedLocation ||
        currentLocation ||
        DEFAULT_LOCATION;

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="fullScreen"
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.headerText}>
                        <Text style={styles.title}>
                            Selecciona la ubicación
                        </Text>

                        <Text style={styles.subtitle}>
                            Toca el mapa o mueve el marcador para elegir
                            el punto del negocio.
                        </Text>
                    </View>

                    <TouchableOpacity
                        onPress={onClose}
                        style={styles.closeButton}
                    >
                        <Text style={styles.closeText}>
                            Cerrar
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.mapContainer}>
                    <MapPickerPlatform
                        initialLocation={initialMapLocation}
                        selectedLocation={selectedLocation}
                        currentLocation={currentLocation}
                        onLocationChange={setSelectedLocation}
                    />

                    {loadingLocation && (
                        <View style={styles.loading}>
                            <ActivityIndicator size="small" />

                            <Text style={styles.loadingText}>
                                Obteniendo ubicación...
                            </Text>
                        </View>
                    )}

                    {!loadingLocation && locationError && (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>
                                {locationError}
                            </Text>
                        </View>
                    )}
                </View>

                <View style={styles.footer}>
                    <Text style={styles.coordinates}>
                        {selectedLocation
                            ? `${selectedLocation.latitude.toFixed(6)}, ${selectedLocation.longitude.toFixed(6)}`
                            : "Selecciona un punto en el mapa"}
                    </Text>

                    <View style={styles.footerActions}>
                        <TouchableOpacity
                            onPress={onClose}
                            style={styles.cancelButton}
                        >
                            <Text style={styles.cancelText}>
                                Cancelar
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={handleConfirm}
                            disabled={!selectedLocation}
                            style={[
                                styles.confirmButton,
                                !selectedLocation && styles.disabledButton,
                            ]}
                        >
                            <Text style={styles.confirmText}>
                                Confirmar ubicación
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    header: {
        minHeight: 84,
        paddingHorizontal: 20,
        paddingVertical: 14,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
    },
    headerText: {
        flex: 1,
    },
    title: {
        fontSize: 18,
        fontWeight: "700",
        color: "#121212",
    },
    subtitle: {
        marginTop: 4,
        fontSize: 13,
        color: "#666666",
    },
    closeButton: {
        padding: 10,
    },
    closeText: {
        color: "#555555",
        fontWeight: "600",
    },
    mapContainer: {
        flex: 1,
        overflow: "hidden",
    },
    loading: {
        position: "absolute",
        top: 12,
        alignSelf: "center",
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        backgroundColor: "#FFFFFF",
        paddingHorizontal: 14,
        paddingVertical: 9,
        borderRadius: 20,
        elevation: 3,
    },
    loadingText: {
        fontSize: 12,
        color: "#333333",
    },
    errorContainer: {
        position: "absolute",
        top: 12,
        left: 16,
        right: 16,
        backgroundColor: "#FFF4E5",
        padding: 12,
        borderRadius: 10,
        elevation: 2,
    },
    errorText: {
        fontSize: 12,
        lineHeight: 18,
        color: "#8A4B08",
    },
    footer: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: "#EEEEEE",
    },
    coordinates: {
        fontSize: 12,
        color: "#777777",
        marginBottom: 12,
    },
    footerActions: {
        flexDirection: "row",
        gap: 10,
    },
    cancelButton: {
        flex: 1,
        minHeight: 48,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        backgroundColor: "#F1F1F1",
    },
    cancelText: {
        color: "#333333",
        fontWeight: "600",
    },
    confirmButton: {
        flex: 2,
        minHeight: 48,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        backgroundColor: "#009E66",
    },
    confirmText: {
        color: "#FFFFFF",
        fontWeight: "700",
    },
    disabledButton: {
        opacity: 0.45,
    },
});
