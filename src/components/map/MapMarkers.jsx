import { Marker, Popup } from "react-leaflet";
import { useEffect, useRef } from "react";
import L from "leaflet";
import MarkerPopupCard from "./MarkerPopupCard";
import { markerStatusStyles } from "./statusStyles";

const createMarkerIcon = (status, isSelected = false) => {
  const markerColor =
    markerStatusStyles[status]?.marker || markerStatusStyles.Active.marker;
  const size = isSelected ? 24 : 18;

  return L.divIcon({
    className: "city-map-marker",
    html: `
      <div class="city-map-marker__pin ${isSelected ? "city-map-marker__pin--selected" : ""}" style="display:flex;align-items:center;justify-content:center;width:${size}px;height:${size}px;border-radius:9999px;background:${markerColor};border:${isSelected ? 4 : 3}px solid #FDFBF7;box-shadow:0 10px 24px rgba(44,40,37,0.18);"></div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

export default function MapMarkers({
  locations,
  activeMarkerId,
  selectedMarkerId,
  onMarkerSelect,
}) {
  return locations.map((location) => (
    <MarkerWithPopup
      key={location.caseId}
      location={location}
      shouldOpen={location.caseId === activeMarkerId}
      isSelected={location.caseId === selectedMarkerId}
      onMarkerSelect={onMarkerSelect}
    />
  ));
}

function MarkerWithPopup({ location, shouldOpen, isSelected, onMarkerSelect }) {
  const popupRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (!shouldOpen || !markerRef.current) return;

    markerRef.current.openPopup();
  }, [shouldOpen]);

  return (
    <Marker
      ref={markerRef}
      position={[location.lat, location.lng]}
      icon={createMarkerIcon(location.status, isSelected)}
      eventHandlers={{
        click: () => onMarkerSelect?.(location),
      }}
    >
      <Popup ref={popupRef}>
        <MarkerPopupCard
          location={location}
          onClose={() => popupRef.current?._source?.closePopup()}
        />
      </Popup>
    </Marker>
  );
}
