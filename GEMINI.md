## Project Context

**Project:** Reunite, a missing-persons platform built with React, Tailwind, React Router, and React Leaflet.

**Current phase:** FE-3, focused on map UX, marker interaction, and report-sighting flows.

## What Was Built

- A full-screen `/map` page centered around Ethiopia-wide marker browsing.
- A reusable Leaflet map component in `src/components/map/AddisMap.jsx`.
- Marker rendering, popup cards, bounds fitting, click handling, and selection sync split into small components.
- A `Report Sighting` modal that opens from the map page, validates inputs, and creates new markers instantly.
- Sidebar-to-marker synchronization so clicking a case in the sidebar zooms to the corresponding marker and highlights it.

## Map Feature Flow

1. The map page owns marker state with `useState(sampleLocations)`.
2. The page loads persisted reported sightings from `localStorage` and merges them with sample markers.
3. A `Report Sighting` modal submits a new sighting into React state.
4. Newly reported sightings are stored in `localStorage`.
5. The new marker is highlighted and its popup opens immediately after submit.
6. Sidebar case clicks and map marker clicks keep selection in sync.

## Key Components

- `src/pages/Map.jsx`
  - Owns marker state, selected case state, report modal state, and localStorage persistence.
  - Renders the sidebar case list and the map panel.
  - Opens the report modal from a button or by clicking the map.
- `src/components/map/AddisMap.jsx`
  - Wraps the Leaflet map.
  - Applies dynamic bounds and zoom limits.
  - Wires map click capture, marker rendering, and selection focus.
- `src/components/map/MapBounds.jsx`
  - Uses `L.latLngBounds` and `map.fitBounds(...)` to auto-frame markers.
  - Keeps the bounds logic reusable and isolated.
- `src/components/map/MapSelectionFocus.jsx`
  - Smoothly flies the map to the selected marker.
- `src/components/map/MapMarkers.jsx`
  - Renders markers from data.
  - Highlights selected markers.
  - Opens the popup for the active marker.
- `src/components/map/MarkerPopupCard.jsx`
  - Modern Tailwind popup card.
  - Shows name, age, city/location chips, status, sightings, last seen, and a `View Details` CTA.
- `src/components/map/ReportSightingModal.jsx`
  - Tailwind modal with validation.
  - Fields: name, description, latitude, longitude, optional image.
  - Closes on submit.
- `src/components/map/MapClickCapture.jsx`
  - Captures map clicks and forwards coordinates to the page.

## Marker Data Model

`src/components/map/mapData.js` currently includes sample markers across Ethiopia:

- Addis Ababa
- Bahir Dar
- Hawassa
- Mekelle

Each marker includes:

- `caseId`
- `lat`
- `lng`
- `name`
- `age`
- `city`
- `status`
- `lastSeen`
- `sightingsCount`
- `avatarTone`

Reported sightings reuse the same shape, with a generated `caseId` beginning with `sighting-`.

## UX Details

- Marker colors are status-driven:
  - `Critical` = red
  - `Active` = blue
  - `Resolved` = green
- Marker pins have hover scale animation.
- Popup cards have a subtle entrance animation and hover lift.
- The map uses dynamic bounds instead of a fixed center for multiple markers.
- Single-marker behavior is handled cleanly in the bounds helper path.
- The map has min/max zoom limits to avoid over-zooming.
- Clicking the map opens the report modal with latitude and longitude prefilled.

## Routing And Shell

- The map is exposed as `/map`.
- The app shell hides the normal header/footer on `/map` so the map can use the full viewport.
- `Live Map` is visible in the top nav and footer.

## Persistence

- Reported sightings are persisted in `localStorage` under `reported-sightings`.
- On load, persisted sightings are merged with the sample dataset.
- Only serializable marker data is stored, not the uploaded file object.

## Verification

- The map and modal changes were build-checked with `npm run build`.
- The build passes; the remaining output is existing Vite/PWA chunk-size and plugin warnings.

