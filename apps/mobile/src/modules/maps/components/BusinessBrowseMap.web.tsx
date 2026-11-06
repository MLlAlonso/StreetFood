import { useEffect } from "react";
import L from "leaflet";
import { Marker } from "react-leaflet";
import { CircleMarker, MapContainer, TileLayer, useMap, useMapEvents, } from "react-leaflet";
import type { Coordinates, NearbyBusiness } from "../types/LiveLocation";
import type { LatLngBoundsExpression } from "leaflet";

import "leaflet/dist/leaflet.css";

interface Props {
    initialCenter: Coordinates;
    businesses: NearbyBusiness[];
    selectedBusinessId: number | null;
    onCenterChange: (center: Coordinates, radiusKm: number) => void;
    onMarkerPress: (business: NearbyBusiness) => void;
}

interface MapEventsProps { onCenterChange: Props["onCenterChange"]; }

function MapEvents({ onCenterChange }: MapEventsProps) {
    const map = useMapEvents({
        moveend: () => {
            const center = map.getCenter();
            const bounds = map.getBounds();
            const radiusKm = calculateRadiusKm(center.lat, center.lng, bounds);
            onCenterChange({ latitude: center.lat, longitude: center.lng, }, radiusKm);
        },
    });

    return null;
}

function calculateRadiusKm(latitude: number, longitude: number, bounds: any): number {
    const northEast = bounds.getNorthEast();
    const latDistance = Math.abs(northEast.lat - latitude) * 111;
    const lngDistance = Math.abs(northEast.lng - longitude) * 111 * Math.cos((latitude * Math.PI) / 180);
    const radius = Math.sqrt(latDistance ** 2 + lngDistance ** 2);
    return Math.min(Math.max(radius, 1), 100);
}

function RecenterMap({ center }: { center: Coordinates }) {
    const map = useMap();
    useEffect(() => { map.setView([center.latitude, center.longitude], map.getZoom()); }, [center.latitude, center.longitude, map]);
    return null;
}

const BUSINESS_ICON_URL = "https://res.cloudinary.com/bcyzogrf/image/upload/v1792562052/buska-isotipo-color.svg";

function createBusinessIcon(isOpen: boolean, isSelected: boolean) {
    return L.divIcon({
        className: "buska-business-marker",
        html: `
            <div class="buska-marker ${isOpen ? "open" : "closed"} ${isSelected ? "selected" : ""}">
                <img src="${BUSINESS_ICON_URL}" alt="Buska" />
            </div>
        `,
        iconSize: [46, 46],
        iconAnchor: [23, 23],
    });
}

export default function BusinessBrowseMap({ initialCenter, businesses, selectedBusinessId, onCenterChange, onMarkerPress, }: Props) {
    const center: [number, number] = [initialCenter.latitude, initialCenter.longitude,];

    return (
        <MapContainer center={center} zoom={14} style={{ width: "100%", height: "100%", minHeight: 400, position: "relative", zIndex: 0, }} >
            <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <MapEvents onCenterChange={onCenterChange} />

            {businesses.map((business) => {
                const isOpen = business.status === "open";
                const isSelected = business.id === selectedBusinessId;

                return (
                    <Marker
                        key={business.id}
                        position={[business.latitude, business.longitude,]}
                        icon={createBusinessIcon(isOpen, isSelected)}
                        eventHandlers={{ click: () => onMarkerPress(business), }}
                    />
                );
            })}

            <style>{markerStyles}</style>
        </MapContainer>
    );
}


const markerStyles = `
    .buska-business-marker {
        background: transparent;
        border: none;
    }

    .buska-marker {
        width: 46px;
        height: 46px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        border: 3px solid #FFFFFF;
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.35);
        transition: transform 0.15s ease;
    }

    .buska-marker.open {
        background: #1C8F6A;
    }

    .buska-marker.closed {
        background: #777777;
    }

    .buska-marker.selected {
        border: 4px solid #1677FF;
        transform: scale(1.2);
    }

    .buska-marker img {
        width: 27px;
        height: 27px;
        object-fit: contain;
    }
`;