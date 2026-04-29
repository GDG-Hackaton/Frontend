import L from "leaflet";
import { useEffect } from "react";
import { useMap } from "react-leaflet";

export const getMarkerBounds = (locations = []) =>
  L.latLngBounds(locations.map((location) => [location.lat, location.lng]));

export function FitMapToMarkers({
  locations,
  padding = [48, 48],
  maxFitZoom = 14,
  duration = 1.1,
}) {
  const map = useMap();

  useEffect(() => {
    if (!map || !locations || locations.length === 0) return;

    try {
      const bounds = getMarkerBounds(locations);
      if (bounds.isValid()) {
        map.flyToBounds(bounds, {
          padding,
          maxZoom: maxFitZoom,
          animate: true,
          duration,
        });
      }
    } catch (error) {
      console.warn("MapBounds: Could not fit map to markers", error);
    }
  }, [duration, locations, map, maxFitZoom, padding]);

  return null;
}
