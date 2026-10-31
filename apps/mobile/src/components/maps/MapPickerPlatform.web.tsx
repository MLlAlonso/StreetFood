import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { CircleMarker, MapContainer, TileLayer, useMap, useMapEvents, } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import type { MapCoordinates } from "./MapPickerModal";

interface Props {
    initialLocation: MapCoordinates;
    currentLocation: MapCoordinates | null;
    selectedLocation: MapCoordinates | null;
    onLocationChange: (location: MapCoordinates) => void;
}

function MapController({ location, }: { location: MapCoordinates; }) {
    const map = useMap();

    useEffect(() => {
        map.setView([location.latitude, location.longitude], 16, { animate: true });
    }, [location.latitude, location.longitude, map,
    ]);

    return null;
}

function MapClickHandler({ onLocationChange, }: { onLocationChange: (location: MapCoordinates) => void; }) {
    useMapEvents({
        click(event) { onLocationChange({ latitude: event.latlng.lat, longitude: event.latlng.lng, }); },
    });

    return null;
}

export default function MapPickerPlatform({ initialLocation, currentLocation, selectedLocation, onLocationChange, }: Props) {
    return (
        <View style={styles.container}>
            <MapContainer center={[initialLocation.latitude, initialLocation.longitude,]} zoom={16} style={styles.map} scrollWheelZoom >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapController location={initialLocation} />

                <MapClickHandler onLocationChange={onLocationChange} />

                {/* Ubicación actual del dispositivo */}
                {currentLocation && (
                    <CircleMarker
                        center={[currentLocation.latitude, currentLocation.longitude,]}
                        radius={8}
                        pathOptions={{ color: "#2878D0", fillColor: "#2878D0", fillOpacity: 0.9, }}
                    />
                )}

                {/* Ubicación seleccionada del negocio */}
                {selectedLocation && (
                    <CircleMarker
                        center={[selectedLocation.latitude, selectedLocation.longitude,]}
                        radius={10}
                        pathOptions={{ color: "#009E66", fillColor: "#009E66", fillOpacity: 0.9, }}
                    />
                )}
            </MapContainer>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        minHeight: 300,
    },
    map: {
        width: "100%",
        height: "100%",
        minHeight: 300,
    },
});