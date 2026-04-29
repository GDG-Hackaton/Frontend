import { MapContainer, ZoomControl } from "react-leaflet";
import MapMarkers from "./MapMarkers";
import { FitMapToMarkers } from "./MapBounds";
import MapClickCapture from "./MapClickCapture";
import MapSelectionFocus from "./MapSelectionFocus";
import MapTiles from "./MapTiles";
import { useEffect, useState } from "react";

const MIN_MAP_ZOOM = 6;
const MAX_MAP_ZOOM = 15;

export default function AddisMap({
  locations = [],
  activeMarkerId = null,
  selectedMarkerId = null,
  selectedLocation = null,
  onMapClick,
  onMarkerSelect,
  onTileStatusChange,
}) {
  const [tileStatus, setTileStatus] = useState("loading");

  useEffect(() => {
    onTileStatusChange?.(tileStatus);
  }, [onTileStatusChange, tileStatus]);

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={[9.145, 40.4896]}
        zoom={6}
        minZoom={MIN_MAP_ZOOM}
        maxZoom={MAX_MAP_ZOOM}
        zoomControl={false}
        scrollWheelZoom
        className="h-full w-full"
      >
        <ZoomControl position="bottomright" />
        <MapTiles onLoadStateChange={setTileStatus} />
        <FitMapToMarkers locations={locations} maxFitZoom={14} />
        <MapSelectionFocus selectedLocation={selectedLocation} />
        <MapClickCapture onMapClick={onMapClick} />
        <MapMarkers
          locations={locations}
          activeMarkerId={activeMarkerId}
          selectedMarkerId={selectedMarkerId}
          onMarkerSelect={onMarkerSelect}
        />
      </MapContainer>

      {tileStatus !== "loaded" ? (
        <div className="pointer-events-none absolute inset-0 z-[450] flex items-center justify-center bg-[#fdfbf7]/35 backdrop-blur-[1px]">
          <div className="rounded-full border border-white/70 bg-white/85 px-4 py-2 shadow-[0_12px_30px_rgba(44,40,37,0.12)]">
            <div className="flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-terracotta/40" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-terracotta" />
              </span>
              <span className="text-sm font-semibold text-charcoal">
                {tileStatus === "error" ? "Map tiles reloading" : "Syncing live map"}
              </span>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
