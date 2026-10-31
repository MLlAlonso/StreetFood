declare module "@/modules/maps/components/BusinessRouteMap" {
    import type { ComponentType } from "react";
    import type { Coordinates } from "@/modules/maps/types/LiveLocation";

    interface BusinessRouteMapProps {
        origin: Coordinates;
        destination: Coordinates;
        routePoints: Coordinates[];
    }

    const BusinessRouteMap: ComponentType<BusinessRouteMapProps>;
    export default BusinessRouteMap;
}