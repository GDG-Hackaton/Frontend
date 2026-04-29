import { useEffect, useState } from "react";
import { TileLayer } from "react-leaflet";

export default function MapTiles({
  onLoadStateChange,
}) {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    onLoadStateChange?.(status);
  }, [onLoadStateChange, status]);

  return (
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      eventHandlers={{
        loading: () => setStatus("loading"),
        load: () => setStatus("loaded"),
        tileerror: () => setStatus("error"),
      }}
    />
  );
}
