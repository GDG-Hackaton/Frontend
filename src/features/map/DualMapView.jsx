import React, { useEffect, useRef, useState } from "react";
import {
  useLocation as useRouterLocation,
  useNavigate,
} from "react-router-dom";
import L from "leaflet";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import QuickSighting from "./QuickSighting";
import AIAssistant from "./AIAssistant";
import { usePassiveVigilance } from "@/hooks/usePassiveVigilance";

import {
  MapPin,
  Navigation,
  ExternalLink,
  AlertTriangle,
  Activity,
  Footprints,
  Maximize2,
  Compass,
  Eye,
  Bell,
  BellOff,
} from "lucide-react";
import { toast } from "sonner";
import { useLocation } from "@/hooks/useLocation";
import { caseService } from "@/services/caseService";
import {
  initializeMap,
  createGoogleMapsUrl,
  createGoogleMapsDirectionsUrl,
  calculateDistance,
  createAnimatedMarker,
  createHeatmapLayer,
  createMovementTrail,
  fitMapToPoints,
  getMapFallbackUrl,
} from "@/services/mapService";
import useMapStore from "./mapStore";
import "leaflet/dist/leaflet.css";

export default function DualMapView({ caseData: propCaseData }) {
  const navigate = useNavigate();
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layersRef = useRef({
    markers: [],
    heatmap: null,
    trail: null,
    userMarker: null,
  });

  const routerLocation = useRouterLocation();
  const { location: userLocation, getCurrentLocation } = useLocation();

  // Use store for state management
  const {
    selectedCase: storeSelectedCase,
    mapMode: storeMapMode,
    setSelectedCase,
    setMapMode,
  } = useMapStore();

  // Use prop if provided, otherwise use store
  const effectiveCaseData = propCaseData || storeSelectedCase;
  const effectiveMapMode = propCaseData ? "context" : storeMapMode;

  const [mapHealthy, setMapHealthy] = useState(true);
  const [fallbackUrl, setFallbackUrl] = useState(null);
  const [nearbyCase, setNearbyCases] = useState(null);
  const [stats, setStats] = useState({
    distance: null,
    sightingCount: 0,
    trailPoints: [],
  });

  const [showQuickSighting, setShowQuickSighting] = useState(false);
  const [sightingPosition, setSightingPosition] = useState(null);
  const {
    isMonitoring,
    startMonitoring,
    stopMonitoring,
    quickSighting,
    nearbyCases,
  } = usePassiveVigilance();

  const DEFAULT_ZOOM = 12;
  const DEFAULT_CENTER = [9.032, 38.7469]; // Addis Ababa

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    try {
      const center = userLocation
        ? [userLocation.latitude, userLocation.longitude]
        : DEFAULT_CENTER;

      const map = initializeMap(mapContainerRef.current, { center });
      mapInstanceRef.current = map;

      // Check tile layer health
      setTimeout(async () => {
        const fallback = await getMapFallbackUrl(
          userLocation?.latitude || DEFAULT_CENTER[0],
          userLocation?.longitude || DEFAULT_CENTER[1],
        );

        if (fallback.type === "google") {
          setMapHealthy(false);
          setFallbackUrl(fallback.url);
        }
      }, 3000);

      // Add scale control
      L.control.scale({ imperial: false, metric: true }).addTo(map);

      return () => {
        map.remove();
        mapInstanceRef.current = null;
      };
    } catch (error) {
      console.error("Map initialization failed:", error);
      setMapHealthy(false);
      toast.error("Map failed to load. Try Google Maps fallback.");
    }
  }, []);

  // Handle user location
  useEffect(() => {
    if (!mapInstanceRef.current || !userLocation) return;

    const map = mapInstanceRef.current;

    // Clear existing user marker
    if (layersRef.current.userMarker) {
      map.removeLayer(layersRef.current.userMarker);
    }

    // Add user location marker
    const userMarker = createAnimatedMarker(
      [userLocation.latitude, userLocation.longitude],
      { color: "#10B981", pulse: true, label: "You" },
    ).addTo(map);

    layersRef.current.userMarker = userMarker;

    // Center on user if in default mode
    if (effectiveMapMode === "default" && !propCaseData) {
      map.setView(
        [userLocation.latitude, userLocation.longitude],
        map.getZoom(),
      );
    }

    // Load nearby cases
    loadNearbyCases(userLocation.latitude, userLocation.longitude);
  }, [userLocation, effectiveMapMode]);

  // Handle case data changes
  useEffect(() => {
    if (effectiveCaseData) {
      updateContextMap(effectiveCaseData);
      calculateStats(effectiveCaseData);
    }
  }, [effectiveCaseData]);

  // Long press handler on map
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    const map = mapInstanceRef.current;

    // Single click for navigation
    map.on("click", (e) => {
      const clickedLatLng = e.latlng;
      const googleMapsUrl = createGoogleMapsUrl(
        clickedLatLng.lat,
        clickedLatLng.lng,
      );
      window.open(googleMapsUrl, "_blank");
    });

    map.on("contextmenu", (e) => {
      setSightingPosition(e.latlng);
      setShowQuickSighting(true);
    });

    // For mobile: long press
    let pressTimer;
    map.on("mousedown", (e) => {
      pressTimer = setTimeout(() => {
        setSightingPosition(e.latlng);
        setShowQuickSighting(true);
      }, 500);
    });

    map.on("mouseup", () => clearTimeout(pressTimer));
    map.on("mousemove", () => clearTimeout(pressTimer));

    return () => {
      map.off("click");
      map.off("contextmenu");
      map.off("mousedown");
      map.off("mouseup");
      map.off("mousemove");
    };
  }, [mapInstanceRef.current]);

  // Handle URL case ID
  useEffect(() => {
    const caseId = routerLocation.pathname.match(/\/case\/(.+)/)?.[1];
    if (caseId && !propCaseData) {
      loadCaseData(caseId);
    }
  }, [routerLocation]);

  const loadNearbyCases = async (lat, lng) => {
    try {
      const response = await caseService.getNearbyCases(lat, lng, 10000);
      setNearbyCases(response.data);
      addCaseMarkers(response.data);
    } catch (error) {
      console.error("Failed to load nearby cases:", error);
    }
  };

  const loadCaseData = async (caseId) => {
    try {
      const response = await caseService.getCaseById(caseId);
      setSelectedCase(response.data);
      setMapMode("context");
    } catch (error) {
      console.error("Failed to load case:", error);
      toast.error("Failed to load case details");
    }
  };

  const calculateStats = (caseData) => {
    const points = [];

    if (caseData.lastSeen?.location?.coordinates) {
      points.push({
        lat: caseData.lastSeen.location.coordinates[1],
        lng: caseData.lastSeen.location.coordinates[0],
        type: "lastSeen",
      });
    }

    if (caseData.sightings) {
      caseData.sightings.forEach((s) => {
        if (s.location?.coordinates) {
          points.push({
            lat: s.location.coordinates[1],
            lng: s.location.coordinates[0],
            type: "sighting",
          });
        }
      });
    }

    let distance = null;
    if (userLocation && caseData.lastSeen?.location?.coordinates) {
      distance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        caseData.lastSeen.location.coordinates[1],
        caseData.lastSeen.location.coordinates[0],
      );
    }

    setStats({
      distance: distance
        ? {
            kilometers: distance,
            formatted:
              distance < 1
                ? `${Math.round(distance * 1000)} meters`
                : `${distance.toFixed(1)} km`,
          }
        : null,
      sightingCount: caseData.sightings?.length || 0,
      trailPoints: points,
    });
  };

  const addCaseMarkers = (cases) => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    // Clear existing markers
    layersRef.current.markers.forEach((marker) => map.removeLayer(marker));
    layersRef.current.markers = [];

    cases.forEach((caseItem) => {
      if (!caseItem.lastSeen?.location?.coordinates) return;

      const color = caseItem.priority?.level === "HIGH" ? "#EF4444" : "#F59E0B";

      const marker = createAnimatedMarker(
        [
          caseItem.lastSeen.location.coordinates[1],
          caseItem.lastSeen.location.coordinates[0],
        ],
        { color, pulse: caseItem.priority?.level === "HIGH" },
      );

      marker.bindPopup(`
        <div style="min-width: 200px;">
          <h3 style="font-weight: bold; margin-bottom: 8px;">
            ${caseItem.person?.name || "Unknown"}
            ${caseItem.person?.age ? "(" + caseItem.person.age + ")" : ""}
          </h3>
          <p style="font-size: 12px; color: #666; margin-bottom: 8px;">
            ${caseItem.aiData?.summary || "No summary available"}
          </p>
          <button 
            onclick="window.location.href='/case/${caseItem.caseId}'"
            style="
              width: 100%;
              padding: 8px;
              background: #3B82F6;
              color: white;
              border: none;
              border-radius: 4px;
              cursor: pointer;
            "
          >
            View Details
          </button>
        </div>
      `);

      marker.addTo(map);
      layersRef.current.markers.push(marker);
    });
  };

  const updateContextMap = (caseData) => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    // Clear existing layers
    if (layersRef.current.heatmap) {
      map.removeLayer(layersRef.current.heatmap);
    }
    if (layersRef.current.trail) {
      map.removeLayer(layersRef.current.trail.polyline);
    }
    layersRef.current.markers.forEach((m) => map.removeLayer(m));
    layersRef.current.markers = [];

    const points = [];
    const heatmapPoints = [];

    // Add last seen location
    if (caseData.lastSeen?.location?.coordinates) {
      const lat = caseData.lastSeen.location.coordinates[1];
      const lng = caseData.lastSeen.location.coordinates[0];

      points.push([lat, lng]);
      heatmapPoints.push([lat, lng, 1.0]);

      const lastSeenMarker = createAnimatedMarker([lat, lng], {
        color: "#EF4444",
        pulse: true,
        label: "Last Seen",
      }).addTo(map);

      lastSeenMarker.bindPopup(`
        <div>
          <h4 style="font-weight: bold;">Last Seen Location</h4>
          <p>${caseData.lastSeen.address || "Unknown address"}</p>
          <p>${new Date(caseData.lastSeen.timestamp).toLocaleString()}</p>
        </div>
      `);

      layersRef.current.markers.push(lastSeenMarker);
    }

    // Add sightings
    if (caseData.sightings) {
      caseData.sightings.forEach((sighting, index) => {
        if (!sighting.location?.coordinates) return;

        const lat = sighting.location.coordinates[1];
        const lng = sighting.location.coordinates[0];
        const confidence = sighting.confidence || 50;

        points.push([lat, lng]);
        heatmapPoints.push([lat, lng, confidence / 100]);

        const sightingMarker = L.marker([lat, lng], {
          icon: L.divIcon({
            html: `<div style="
              width: 12px;
              height: 12px;
              background: #8B5CF6;
              border: 2px solid white;
              border-radius: 50%;
            "></div>`,
            className: "sighting-marker",
            iconSize: [16, 16],
            iconAnchor: [8, 8],
          }),
        }).addTo(map);

        sightingMarker.bindPopup(`
          <div>
            <h4 style="font-weight: bold;">Sighting #${index + 1}</h4>
            <p>Confidence: ${confidence}%</p>
            <p>${sighting.description || "No description"}</p>
            <p>${new Date(sighting.timestamp).toLocaleString()}</p>
          </div>
        `);

        layersRef.current.markers.push(sightingMarker);
      });
    }

    // Create heatmap if we have points
    if (heatmapPoints.length > 1) {
      const heatmap = createHeatmapLayer(heatmapPoints);
      heatmap.addTo(map);
      layersRef.current.heatmap = heatmap;
    }

    // Create movement trail
    if (points.length >= 2) {
      const trail = createMovementTrail(map, points, { color: "#EF4444" });
      layersRef.current.trail = trail;
    }

    // Fit map to points
    if (points.length > 0) {
      fitMapToPoints(map, points);
    }
  };

  const switchToDefaultMode = () => {
    setMapMode("default");
    setSelectedCase(null);

    if (mapInstanceRef.current && userLocation) {
      mapInstanceRef.current.setView(
        [userLocation.latitude, userLocation.longitude],
        DEFAULT_ZOOM,
      );
      loadNearbyCases(userLocation.latitude, userLocation.longitude);
    }
  };

  const openInGoogleMaps = () => {
    let url;

    if (effectiveMapMode === "context" && effectiveCaseData) {
      const points = stats.trailPoints.map((p) => [p.lat, p.lng]);
      url = createGoogleMapsDirectionsUrl(points);
    } else if (userLocation) {
      url = createGoogleMapsUrl(userLocation.latitude, userLocation.longitude);
    } else {
      url = createGoogleMapsUrl(DEFAULT_CENTER[0], DEFAULT_CENTER[1]);
    }

    window.open(url, "_blank");
  };

  return (
    <div className="space-y-4">
      {/* Map Controls */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button
            variant={effectiveMapMode === "default" ? "default" : "outline"}
            onClick={switchToDefaultMode}
          >
            <Compass className="w-4 h-4 mr-2" />
            My Location
          </Button>

          {effectiveCaseData && (
            <Button
              variant={effectiveMapMode === "context" ? "default" : "outline"}
            >
              <MapPin className="w-4 h-4 mr-2" />
              Case View
            </Button>
          )}
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={getCurrentLocation}>
            <Navigation className="w-4 h-4 mr-2" />
            Update Location
          </Button>

          <Button variant="outline" onClick={openInGoogleMaps}>
            <ExternalLink className="w-4 h-4 mr-2" />
            Google Maps
          </Button>
        </div>
      </div>
      {/* Quick Sighting Modal */}
      {showQuickSighting && sightingPosition && (
        <QuickSighting
          position={sightingPosition}
          onClose={() => setShowQuickSighting(false)}
          onSubmit={(description) => {
            quickSighting(sightingPosition, description);
          }}
        />
      )}

      {/* Nearby Cases Indicator */}
      {nearbyCases.length > 0 && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000]">
          <Badge
            className="bg-red-500 text-white px-4 py-2 shadow-lg cursor-pointer"
            onClick={() => navigate("/volunteer")}
          >
            📍 {nearbyCases.length} Active Case
            {nearbyCases.length > 1 ? "s" : ""} Near You
          </Badge>
        </div>
      )}

      {/* Map Health Warning */}
      {!mapHealthy && fallbackUrl && (
        <Alert variant="warning">
          <AlertTriangle className="w-4 h-4" />
          <AlertDescription>
            Map tiles are loading slowly.
            <a
              href={fallbackUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 underline"
            >
              Open in Google Maps instead
            </a>
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Bar */}
      {effectiveMapMode === "context" && stats.distance && (
        <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Footprints className="w-4 h-4 text-gray-600" />
            <span className="text-sm">
              Distance from you: <strong>{stats.distance.formatted}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-gray-600" />
            <span className="text-sm">
              Sightings: <strong>{stats.sightingCount}</strong>
            </span>
          </div>
        </div>
      )}

      {/* Map Container */}
      <Card>
        <CardContent className="p-0 relative">
          <div
            ref={mapContainerRef}
            style={{ height: "600px", width: "100%" }}
            className="rounded-lg overflow-hidden"
          />

          <div className="absolute top-4 right-4 z-[1000] bg-white rounded-lg shadow-lg">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (mapInstanceRef.current && stats.trailPoints.length > 0) {
                  fitMapToPoints(
                    mapInstanceRef.current,
                    stats.trailPoints.map((p) => [p.lat, p.lng]),
                  );
                }
              }}
              disabled={stats.trailPoints.length === 0}
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* AI Assistant */}
      <AIAssistant caseData={effectiveCaseData} userLocation={userLocation} />
    </div>
  );
}
