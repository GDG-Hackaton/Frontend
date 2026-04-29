import { useEffect } from "react";
import { useMap } from "react-leaflet";

export default function MapSelectionFocus({
  selectedLocation,
  zoom = 14,
  duration = 0.9,
}) {
  const map = useMap();

  useEffect(() => {
    if (!map || !selectedLocation || !selectedLocation.lat || !selectedLocation.lng) return;

    try {
      map.flyTo([selectedLocation.lat, selectedLocation.lng], zoom, {
        duration,
      });
    } catch (error) {
      console.warn("MapSelectionFocus: Could not focus on selected location", error);
    }
  }, [duration, map, selectedLocation, zoom]);

  return null;
}
