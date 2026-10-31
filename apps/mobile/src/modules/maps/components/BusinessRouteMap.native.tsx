import { useRef } from "react";
import MapView, {
    Marker, Polyline, PROVIDER_GOOGLE,
} from "react-native-maps";

import type { Coordinates } from "../types/LiveLocation";
interface Props { origin: Coordinates; destination: Coordinates; routePoints: Coordinates[]; }

export default function BusinessRouteMap({ origin, destination, routePoints, }: Props) {
    const mapRef = useRef<MapView>(null);
    const coordinates = [origin, ...routePoints, destination,];

    const fitRoute = () => {
        mapRef.current?.fitToCoordinates(coordinates, {
            edgePadding: { top: 60, right: 45, bottom: 60, left: 45, },
            animated: true,
        });
    };

    return (
        <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            style={{ width: "100%", height: "100%" }}
            initialRegion={{
                latitude: (origin.latitude + destination.latitude) / 2,
                longitude: (origin.longitude + destination.longitude) / 2,
                latitudeDelta: 0.08,
                longitudeDelta: 0.08,
            }}
            onMapReady={fitRoute}
            showsUserLocation
            showsMyLocationButton
        >
            <Marker coordinate={origin} title="Tu ubicación" />
            <Marker coordinate={destination} title="Negocio" />

            {routePoints.length > 1 && (
                <Polyline coordinates={routePoints} strokeWidth={5} strokeColor="#1677FF" />
            )}
        </MapView>
    );
}