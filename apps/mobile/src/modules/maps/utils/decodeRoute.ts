import polyline from "@mapbox/polyline";
import type { Coordinates } from "../types/LiveLocation";

export function decodeRoute(encodedPolyline: string): Coordinates[] {
    return polyline.decode(encodedPolyline).map(([latitude, longitude]) => ({ latitude, longitude, }));
}