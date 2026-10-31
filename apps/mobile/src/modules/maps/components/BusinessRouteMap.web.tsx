import { useEffect } from "react";

import { CircleMarker, MapContainer, Polyline, TileLayer, useMap, } from "react-leaflet";
import type { LatLngBoundsExpression } from "leaflet";
import type { Coordinates } from "../types/LiveLocation";

import "leaflet/dist/leaflet.css";

interface Props { origin: Coordinates; destination: Coordinates; routePoints: Coordinates[]; }

function FitRoute({ origin, destination, routePoints, }: Props) {
    const map = useMap();

    useEffect(() => {
        const allPoints = [origin, ...routePoints, destination,];
        const bounds: LatLngBoundsExpression = allPoints.map((point) => [point.latitude, point.longitude,]);
        map.fitBounds(bounds, { padding: [40, 40], });
    }, [map, origin, destination, routePoints]);

    return null;
}

export default function BusinessRouteMap({ origin, destination, routePoints, }: Props) {
    const center: [number, number] = [
        (origin.latitude + destination.latitude) / 2, (origin.longitude + destination.longitude) / 2,
    ];

    return (
        <MapContainer center={center} zoom={14} style={{ width: "100%", height: "100%" }} >
            <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <CircleMarker center={[origin.latitude, origin.longitude]} radius={8} pathOptions={{ color: "#1677FF" }} />
            <CircleMarker center={[destination.latitude, destination.longitude,]} radius={8} pathOptions={{ color: "#E5484D" }} />

            {routePoints.length > 1 && (
                <Polyline
                    positions={routePoints.map((point) => [point.latitude, point.longitude,] as [number, number])}
                    pathOptions={{ color: "#1677FF", weight: 5, }}
                />
            )}

            <FitRoute origin={origin} destination={destination} routePoints={routePoints} />
        </MapContainer>
    );
}
