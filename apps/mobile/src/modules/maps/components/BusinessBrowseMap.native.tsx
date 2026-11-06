import { SvgUri } from "react-native-svg";
import { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Platform, } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Region, } from "react-native-maps";
import type { Coordinates, NearbyBusiness, } from "../types/LiveLocation";

interface Props {
    initialCenter: Coordinates;
    businesses: NearbyBusiness[];
    selectedBusinessId: number | null;
    onCenterChange: (center: Coordinates, radiusKm: number) => void;
    onMarkerPress: (business: NearbyBusiness) => void;
}

const BUSKA_LOGO_URL = "https://res.cloudinary.com/bcyzogrf/image/upload/v1792562052/buska-isotipo-color.svg";

function calculateRadiusKm(region: Region): number {
    const latitudeRadius = (region.latitudeDelta * 111) / 2;
    const longitudeRadius = (region.longitudeDelta * 111 * Math.cos((region.latitude * Math.PI) / 180)) / 2;
    const radius = Math.sqrt(latitudeRadius ** 2 + longitudeRadius ** 2);
    return Math.min(Math.max(radius, 1), 100);
}

export default function BusinessBrowseMap({ initialCenter, businesses, selectedBusinessId, onCenterChange, onMarkerPress, }: Props) {
    const mapRef = useRef<MapView>(null);
    const [markersReady, setMarkersReady] = useState(false);

    const initialRegion: Region = {
        latitude: initialCenter.latitude,
        longitude: initialCenter.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
    };

    useEffect(() => {
        const timeout = setTimeout(() => { setMarkersReady(true); }, 500);
        return () => clearTimeout(timeout);
    }, []);

    return (
        <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={initialRegion}
            onRegionChangeComplete={(region) => {
                const center: Coordinates = { latitude: region.latitude, longitude: region.longitude, };
                onCenterChange(center, calculateRadiusKm(region));
            }}
            showsUserLocation
            showsMyLocationButton
            toolbarEnabled={false}
            moveOnMarkerPress={false}
        >
            {businesses.map((business) => {
                const isOpen = business.status === "open";
                const isSelected = business.id === selectedBusinessId;

                return (
                    <Marker
                        key={business.id}
                        coordinate={{ latitude: business.latitude, longitude: business.longitude, }}
                        onPress={() => onMarkerPress(business)}
                        tracksViewChanges={!markersReady}
                        anchor={{ x: 0.5, y: 0.5, }}
                    >
                        <View style={[styles.markerContainer, isOpen ? styles.openMarker : styles.closedMarker, isSelected ? styles.selectedMarker : null,]} >
                            <View style={[styles.logoContainer, isSelected ? styles.selectedLogoContainer : null,]} >
                                <SvgUri uri={BUSKA_LOGO_URL} width={isSelected ? 32 : 29} height={isSelected ? 32 : 29} />
                            </View>
                        </View>
                    </Marker>
                );
            })}
        </MapView>
    );
}

const styles = StyleSheet.create({
    map: {
        width: "100%",
        height: "100%",
        zIndex: 0,
    },

    markerContainer: {
        width: 52,
        height: 52,
        borderRadius: 26,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 3,
        borderColor: "#FFFFFF",
        elevation: 10,
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 6,
    },

    openMarker: {
        backgroundColor: "#1C8F6A",
    },

    closedMarker: {
        backgroundColor: "#777777",
    },

    selectedMarker: {
        borderColor: "#1677FF",
        borderWidth: 4,
        width: 60,
        height: 60,
        borderRadius: 30,
        elevation: 15,
        shadowOpacity: 0.45,
        shadowRadius: 8,
    },

    logoContainer: {
        justifyContent: "center",
        alignItems: "center",
    },

    selectedLogoContainer: {
        transform: [
            {
                scale: 1.1,
            },
        ],
    },
});