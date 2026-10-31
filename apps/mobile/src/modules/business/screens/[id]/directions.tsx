import { View, Text, ActivityIndicator, TouchableOpacity, ScrollView, } from "react-native";

import { useCallback, useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";

import polyline from "@mapbox/polyline";
import AppHeader from "@/components/layout/AppHeader";
import BottomTabs from "@/components/layout/BottomTabs";
import BusinessRouteMap from "@/modules/maps/components/BusinessRouteMap";

import { getBusinessDirections, type BusinessDirections, } from "@/modules/maps/services/location.service";
import type { Coordinates } from "@/modules/maps/types/LiveLocation";
import { styles } from "@/modules/business/styles/businessDirections.styles";

function getSingleParam(value: string | string[] | undefined) {
    return Array.isArray(value) ? value[0] : value;
}

function decodeRoute(encodedPolyline: string): Coordinates[] {
    return polyline.decode(encodedPolyline).map(
        ([latitude, longitude]) => ({ latitude, longitude, })
    );
}

function formatDistance(meters: number | null) {
    if (meters == null) return "No disponible";

    if (meters < 1000) {
        return `${Math.round(meters)} m`;
    }

    return `${(meters / 1000).toFixed(1)} km`;
}

function formatDuration(duration: string | null) {
    if (!duration) return "No disponible";
    const seconds = Number(duration.replace("s", ""));
    if (!Number.isFinite(seconds)) return duration;
    const minutes = Math.ceil(seconds / 60);

    if (minutes < 60) {
        return `${minutes} min`;
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours} h ${remainingMinutes} min` : `${hours} h`;
}

export default function BusinessDirectionsScreen() {
    const router = useRouter();
    const { id, originLatitude, originLongitude, } = useLocalSearchParams<{ id: string; originLatitude: string; originLongitude: string; }>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [directions, setDirections] = useState<BusinessDirections | null>(null);
    const [routePoints, setRoutePoints] = useState<Coordinates[]>([]);

    const loadDirections = useCallback(async () => {
        const businessId = Number(getSingleParam(id));
        const latitude = Number(getSingleParam(originLatitude));
        const longitude = Number(getSingleParam(originLongitude));
        setDirections(null);
        setRoutePoints([]);
        setError(null);

        if (
            !Number.isInteger(businessId) ||
            businessId <= 0 ||
            !Number.isFinite(latitude) ||
            !Number.isFinite(longitude) ||
            latitude < -90 ||
            latitude > 90 ||
            longitude < -180 ||
            longitude > 180
        ) {
            setError("No se recibieron coordenadas válidas para calcular la ruta.");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const origin: Coordinates = { latitude, longitude, };
            const response = await getBusinessDirections(businessId, origin);

            if (!response.encoded_polyline) {
                throw new Error("ROUTE_NOT_FOUND");
            }

            const decodedPoints = decodeRoute(
                response.encoded_polyline
            );

            if (decodedPoints.length < 2) {
                throw new Error("ROUTE_NOT_FOUND");
            }

            setDirections(response);
            setRoutePoints(decodedPoints);
        } catch (err: any) {
            console.error("Error loading business directions:", err?.response?.data ?? err);
            const status = err?.response?.status;

            if (status === 404) {
                setError("No encontramos una ruta disponible para este negocio.");
            } else if (status === 422) {
                setError("La ubicación de este negocio no está disponible.");
            } else if (status === 503) {
                setError("El servicio de rutas no está configurado actualmente.");
            } else if (status === 502) {
                setError("No fue posible calcular la ruta. Inténtalo nuevamente.");
            } else {
                setError(err?.message === "ROUTE_NOT_FOUND" ? "No encontramos una ruta disponible." : "Ocurrió un error al obtener las indicaciones.");
            }
        } finally {
            setLoading(false);
        }
    }, [id, originLatitude, originLongitude]);

    useEffect(() => { void loadDirections(); }, [loadDirections]);

    return (
        <View style={styles.container}>
            <AppHeader />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content} >
                <View style={styles.header}>
                    <TouchableOpacity activeOpacity={0.8} onPress={() => router.back()} style={styles.backButton} >
                        <Text style={styles.backButtonText}>
                            ← Volver
                        </Text>
                    </TouchableOpacity>

                    <Text style={styles.title}>
                        Indicaciones
                    </Text>

                    <Text style={styles.subtitle}>
                        Ruta hacia el negocio
                    </Text>
                </View>

                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#1677FF" />

                        <Text style={styles.loadingText}>
                            Calculando ruta...
                        </Text>
                    </View>
                ) : error ? (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorTitle}>
                            No fue posible mostrar la ruta
                        </Text>

                        <Text style={styles.errorText}>
                            {error}
                        </Text>

                        <TouchableOpacity activeOpacity={0.85} style={styles.retryButton} onPress={() => void loadDirections()} >
                            <Text style={styles.retryButtonText}>
                                Reintentar
                            </Text>
                        </TouchableOpacity>
                    </View>
                ) : directions ? (
                    <>
                        <View style={styles.routeSummary}>
                            <View style={styles.summaryItem}>
                                <Text style={styles.summaryLabel}>
                                    Distancia
                                </Text>

                                <Text style={styles.summaryValue}>
                                    {formatDistance(directions.distance_meters)}
                                </Text>
                            </View>

                            <View style={styles.summaryDivider} />

                            <View style={styles.summaryItem}>
                                <Text style={styles.summaryLabel}>
                                    Tiempo estimado
                                </Text>

                                <Text style={styles.summaryValue}>
                                    {formatDuration(directions.duration)}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.destinationNotice}>
                            <Text style={styles.destinationNoticeText}>
                                {directions.destination_type === "live"
                                    ? "Destino basado en la ubicación en tiempo real del negocio."
                                    : "Destino basado en la ubicación permanente del negocio."}
                            </Text>
                        </View>

                        <View style={styles.mapContainer}>
                            <BusinessRouteMap origin={directions.origin} destination={directions.destination} routePoints={routePoints} />
                        </View>
                    </>
                ) : null}
            </ScrollView>

            <BottomTabs />
        </View>
    );
}