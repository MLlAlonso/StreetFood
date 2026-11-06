import { useCallback, useEffect, useRef, useState, } from "react";
import { ActivityIndicator, Platform, StyleSheet, Text, TouchableOpacity, View, } from "react-native";
import type { Coordinates, NearbyBusiness, } from "@/modules/maps/types/LiveLocation";
import { getNearbyBusinesses, } from "@/modules/maps/services/location.service";
import { getCurrentCoordinates, } from "@/modules/maps/services/deviceLocation.service";
import BusinessBrowseMap from "@/modules/maps/components/BusinessBrowseMap";
import BusinessMapCard from "@/modules/maps/components/BusinessMapCard";
import { colors } from "@/styles/theme/colors";
import { useTranslation } from "@/translations/hooks/useTranslation";

const DEFAULT_RADIUS_KM = 15;
const MAX_BUSINESSES = 100;
const SEARCH_DEBOUNCE_MS = 350;

export default function BusinessMapScreen() {
    const { t } = useTranslation();
    const [initialCenter, setInitialCenter] = useState<Coordinates | null>(null);
    const [businesses, setBusinesses] = useState<NearbyBusiness[]>([]);
    const [selectedBusiness, setSelectedBusiness] = useState<NearbyBusiness | null>(null);
    const [loadingLocation, setLoadingLocation] = useState(true);
    const [loadingBusinesses, setLoadingBusinesses] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const requestIdRef = useRef(0);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    /**
     * Busca negocios utilizando el centro actual del mapa. 
     * El GPS únicamente se utiliza para inicializar el mapa.
     * Las siguientes búsquedas dependen del centro visible.
     */
    const loadBusinesses = useCallback(
        async (center: Coordinates, radiusKm: number) => {
            const requestId = ++requestIdRef.current;
            const safeRadius = Math.min(Math.max(radiusKm, 1), 100);
            setLoadingBusinesses(true);
            setError(null);

            try {
                const response = await getNearbyBusinesses(center, safeRadius, MAX_BUSINESSES);

                // Ignorar respuestas de búsquedas anteriores.
                if (requestId !== requestIdRef.current) {
                    return;
                }

                setBusinesses(response.businesses);

                // Mantener seleccionada la tarjeta si el negocio  continúa apareciendo en los resultados.
                setSelectedBusiness((current) => {
                    if (!current) {
                        return null;
                    }

                    const updatedBusiness = response.businesses.find((business) => business.id === current.id);
                    return updatedBusiness ?? null;
                });
            } catch {
                if (requestId !== requestIdRef.current) {
                    return;
                }

                setError(t("nearbyLoadError"));
            } finally {
                if (requestId === requestIdRef.current) {
                    setLoadingBusinesses(false);
                }
            }
        },
        [t]
    );

    /**
     * Debounce para evitar múltiples solicitudes mientras el usuario mueve o hace zoom en el mapa.
     */
    const handleCenterChange = useCallback((center: Coordinates, radiusKm: number) => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(() => { loadBusinesses(center, radiusKm); }, SEARCH_DEBOUNCE_MS);
    }, [loadBusinesses]);

    /**
     * Inicializa el mapa utilizando la ubicación del dispositivo.
     * Esta función se ejecuta al entrar al mapa o al pulsar  reintentar si no se pudo obtener la ubicación.
     */
    const initializeMap = useCallback(
        async () => {
            setLoadingLocation(true);
            setError(null);

            try {
                const coordinates = await getCurrentCoordinates();
                setInitialCenter(coordinates);
                await loadBusinesses(coordinates, DEFAULT_RADIUS_KM);
            } catch {
                setInitialCenter(null);
                setError(t("nearbyLocationPermissionRequired"));
            } finally {
                setLoadingLocation(false);
            }
        },
        [loadBusinesses, t]
    );

    /**
     * Inicialización y limpieza del mapa.
     */
    useEffect(() => {
        initializeMap();

        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
                debounceRef.current = null;
            }

            // Invalidar cualquier solicitud pendiente.
            requestIdRef.current++;
        };
    }, [initializeMap]);

    /**
     * Estado de carga inicial.
     */
    if (loadingLocation) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={colors.primary} />

                <Text style={styles.loadingText}>
                    {t("loadingMap")}
                </Text>
            </View>
        );
    }

    /**
     * Estado cuando no se pudo obtener la ubicación.
     */
    if (!initialCenter) {
        return (
            <View style={styles.centered}>
                <Text style={styles.errorTitle}>
                    {t("locationUnavailable")}
                </Text>

                <Text style={styles.errorText}>
                    {error ?? t("nearbyLocationPermissionRequired")}
                </Text>

                <TouchableOpacity style={styles.retryButton} onPress={initializeMap} activeOpacity={0.8} >
                    <Text style={styles.retryButtonText}>
                        {t("retry")}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Mapa principal */}
            <View style={styles.mapContainer}>
                <BusinessBrowseMap
                    initialCenter={initialCenter}
                    businesses={businesses}
                    selectedBusinessId={selectedBusiness?.id ?? null}
                    onCenterChange={handleCenterChange}
                    onMarkerPress={setSelectedBusiness} />
            </View>

            {/* Controles superiores */}
            <View style={styles.topOverlay} pointerEvents="box-none" >
                <View style={styles.searchStatus} pointerEvents="auto" >
                    {loadingBusinesses ? (
                        <ActivityIndicator size="small" color={colors.primary} />
                    ) : null}

                    <Text style={styles.statusText}>
                        {loadingBusinesses ? t("searchingBusinesses") : `${businesses.length} ${t("businessesOnMap")}`}
                    </Text>
                </View>

                {/* Error de búsqueda */}
                {error ? (
                    <TouchableOpacity style={styles.errorBanner} activeOpacity={0.8} onPress={() => { loadBusinesses(initialCenter, DEFAULT_RADIUS_KM); }} >
                        <Text style={styles.errorBannerText}>
                            {error}
                        </Text>
                    </TouchableOpacity>
                ) : null}
            </View>

            {/* Estado sin negocios */}
            {businesses.length === 0 && !loadingBusinesses && !error ? (
                <View style={styles.emptyOverlay} pointerEvents="none" >
                    <Text style={styles.emptyText}>
                        {t("noBusinessesOnMap")}
                    </Text>
                </View>
            ) : null}

            {/* Tarjeta flotante del negocio seleccionado */}
            {selectedBusiness ? (
                <View style={styles.cardOverlay} pointerEvents="box-none" >
                    <BusinessMapCard business={selectedBusiness} onClose={() => setSelectedBusiness(null)} />
                </View>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    /**
     * Contenedor general.
     */
    container: {
        flex: 1,
        position: "relative",
        backgroundColor: colors.background,
        overflow: "hidden",
    },

    /**
     * Contenedor del mapa.
     * Mantiene el mapa en la capa inferior para que las tarjetas y controles puedan superponerse.
     */
    mapContainer: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 0,
        elevation: 0,
    },

    /**
     * Estados de carga y error inicial.
     */
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
        backgroundColor: colors.background,
    },

    loadingText: {
        marginTop: 14,
        color: colors.textMuted,
    },

    errorTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: colors.primary,
        textAlign: "center",
    },

    errorText: {
        marginTop: 10,
        color: colors.textMuted,
        textAlign: "center",
    },

    retryButton: {
        marginTop: 20,
        backgroundColor: colors.primary,
        borderRadius: 10,
        paddingHorizontal: 24,
        paddingVertical: 12,
    },

    retryButtonText: {
        color: "#FFF",
        fontWeight: "600",
    },

    /**
     * Overlay superior.
     */
    topOverlay: {
        position: "absolute",
        top: Platform.OS === "web" ? 12 : 55,
        left: 12,
        right: 12,
        zIndex: 1000,
        elevation: 20,
    },

    searchStatus: {
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "flex-start",
        gap: 8,
        paddingHorizontal: 14,
        paddingVertical: 10,
        backgroundColor: colors.card,
        borderRadius: 12,
        elevation: 6,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2, },
        shadowOpacity: 0.12,
        shadowRadius: 5,
    },

    statusText: {
        color: colors.primary,
        fontSize: 13,
        fontWeight: "600",
    },

    errorBanner: {
        marginTop: 8,
        padding: 10,
        backgroundColor: "#FFF1F0",
        borderRadius: 10,
    },

    errorBannerText: {
        color: "#B42318",
        fontSize: 13,
    },

    /**
     * Mensaje cuando no hay negocios.
     */
    emptyOverlay: {
        position: "absolute",
        top: "45%",
        left: 20,
        right: 20,
        alignItems: "center",
        backgroundColor: colors.card,
        padding: 16,
        borderRadius: 12,
        zIndex: 1000,
        elevation: 20,
    },

    emptyText: {
        color: colors.textMuted,
        textAlign: "center",
    },

    /**
     * Tarjeta flotante.
     * Debe estar por encima del mapa y de los controles.
     */
    cardOverlay: {
        position: "absolute",
        left: 0,
        right: 0,
        // Espacio para las tabs inferiores en móvil.
        bottom: Platform.OS === "web" ? 15 : 85,
        zIndex: 2000,
        elevation: 30,
        backgroundColor: "transparent",
    },
});