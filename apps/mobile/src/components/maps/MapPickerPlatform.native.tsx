import React, { useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Marker, MapPressEvent, Region, } from "react-native-maps";
import type { MapCoordinates } from "./MapPickerModal";

interface Props {
    initialLocation: MapCoordinates;
    currentLocation: MapCoordinates | null;
    selectedLocation: MapCoordinates | null;
    onLocationChange: (location: MapCoordinates) => void;
}

export default function MapPickerPlatform({ initialLocation, currentLocation, selectedLocation, onLocationChange, }: Props) {
    const mapRef = useRef<MapView>(null);
    const region: Region = { ...initialLocation, latitudeDelta: 0.012, longitudeDelta: 0.012, };
    useEffect(() => { mapRef.current?.animateToRegion(region, 350); }, [initialLocation.latitude, initialLocation.longitude,]);
    const handleMapPress = (event: MapPressEvent) => { onLocationChange(event.nativeEvent.coordinate); };

    return (
        <View style={styles.container}>
            <MapView
                ref={mapRef}
                style={StyleSheet.absoluteFill}
                initialRegion={region}
                onPress={handleMapPress}
                showsUserLocation
                showsMyLocationButton
                showsCompass
            >
                {currentLocation && (
                    <Marker coordinate={currentLocation} title="Tu ubicación actual" pinColor="#2878D0" tracksViewChanges={false} />
                )}

                {selectedLocation && (
                    <Marker
                        coordinate={selectedLocation}
                        title="Ubicación del negocio"
                        description="Puedes mover este marcador para cambiar la ubicación."
                        draggable
                        pinColor="#009E66"
                        onDragEnd={(event) => onLocationChange(event.nativeEvent.coordinate)}
                    />
                )}
            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});