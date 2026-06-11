import {
  memo,
  useEffect,
  useMemo,
  useState,
} from "react";

import { resolveDestinationCoords } from "../../utils/geocodeCache";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";

const MAHARASHTRA_COORDINATES = [
  { keys: ["rajmachi", "lonavala"], coords: [18.8339, 73.3946], zoom: 12 },
  { keys: ["kalsubai", "igatpuri"], coords: [19.6012, 73.7092], zoom: 12 },
  { keys: ["harishchandragad"], coords: [19.3866, 73.7797], zoom: 12 },
  { keys: ["lohagad", "malavli"], coords: [18.7108, 73.4788], zoom: 13 },
  { keys: ["visapur"], coords: [18.7163, 73.4879], zoom: 13 },
  { keys: ["tikona", "pawna"], coords: [18.6327, 73.5126], zoom: 12 },
  { keys: ["bhandardara"], coords: [19.5378, 73.7517], zoom: 12 },
  { keys: ["andharban", "tamhini"], coords: [18.4825, 73.4176], zoom: 12 },
  { keys: ["torna", "velhe"], coords: [18.2761, 73.6211], zoom: 12 },
  { keys: ["sinhagad", "pune"], coords: [18.3663, 73.7559], zoom: 12 },
  { keys: ["alibaug"], coords: [18.6414, 72.8722], zoom: 12 },
  { keys: ["konkan", "dapoli"], coords: [17.7586, 73.1855], zoom: 11 },
  { keys: ["malshej"], coords: [19.3339, 73.7772], zoom: 11 },
  { keys: ["maharashtra"], coords: [19.7515, 75.7139], zoom: 7 },
];

const PICKUP_COORDINATES = [
  { keys: ["shivajinagar", "pune"], coords: [18.5308, 73.8475] },
  { keys: ["dadar", "mumbai"], coords: [19.0178, 72.8478] },
  { keys: ["thane"], coords: [19.2183, 72.9781] },
  { keys: ["lonavala"], coords: [18.7546, 73.4062] },
];

const matchCoordinates = (value, fallback = MAHARASHTRA_COORDINATES.at(-1)) => {
  const text = String(value || "").toLowerCase();
  return (
    MAHARASHTRA_COORDINATES.find((item) =>
      item.keys.some((key) => text.includes(key))
    ) || fallback
  );
};

const matchPickup = (value, index, center) => {
  const text = String(value || "").toLowerCase();
  const matched = PICKUP_COORDINATES.find((item) =>
    item.keys.some((key) => text.includes(key))
  );

  if (matched) return matched.coords;

  return [
    center[0] - 0.018 * (index + 1),
    center[1] + 0.012 * (index + 1),
  ];
};

const itemCoords = (item) => {
  if (!item || typeof item !== "object") return null;
  const lat = Number(item.latitude ?? item.lat);
  const lng = Number(item.longitude ?? item.lng ?? item.lon);
  const valid =
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180;
  return valid ? [lat, lng] : null;
};

const attractionCoords = (item) => {
  const explicit = itemCoords(item);
  if (explicit) return explicit;
  const label = typeof item === "string" ? item : item?.name || item?.place || "";
  const matched = matchCoordinates(label, null);
  return matched?.coords || null;
};

function FitBounds({ positions, fallbackCenter, fallbackZoom }) {
  const map = useMap();

  useEffect(() => {
    const valid = positions.filter(Boolean);
    if (valid.length > 1) {
      map.fitBounds(valid, { padding: [34, 34], maxZoom: 13 });
    } else if (valid.length === 1) {
      map.setView(valid[0], fallbackZoom);
    } else {
      map.setView(fallbackCenter, fallbackZoom);
    }
  }, [fallbackCenter, fallbackZoom, map, positions]);

  return null;
}

const markerIcon = (type) => {
  const styles = {
    destination: "background:#f97316;border-color:#fff;color:#fff;",
    hotel: "background:#0f172a;border-color:#fed7aa;color:#fff;",
    restaurant: "background:#ea580c;border-color:#ffedd5;color:#fff;",
    attraction: "background:#f8fafc;border-color:#f97316;color:#0f172a;",
    pickup: "background:#475569;border-color:#ffedd5;color:#fff;",
  };

  const labels = {
    destination: "D",
    hotel: "H",
    restaurant: "R",
    attraction: "A",
    pickup: "P",
  };

  return L.divIcon({
    className: "",
    html: `<div style="${styles[type]} width:30px;height:30px;border-radius:999px;border-width:2px;border-style:solid;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:12px;">${labels[type]}</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -16],
  });
};

/* ===================================================== */
/* COMPONENT */
/* ===================================================== */

function TravelMap({
  destination,
  location,
  hotels = [],
  restaurants = [],
  pickupPoints = [],
  nearbyAttractions = [],
  heightClass = "h-[320px] md:h-[420px]",
  showChrome = true,
}) {

  /* ===================================================== */
  /* DEFAULT LOCATION */
  /* ===================================================== */

  const matchedLocation = useMemo(
    () => matchCoordinates(`${destination || ""} ${location || ""}`),
    [destination, location]
  );

  const [resolvedLocation, setResolvedLocation] = useState(matchedLocation);
  const [geoLoading, setGeoLoading] = useState(false);

  useEffect(() => {
    let active = true;
    setResolvedLocation(matchedLocation);

    const label = `${destination || ""} ${location || ""}`.trim();
    if (!label || (matchedLocation.zoom && matchedLocation.zoom >= 11)) {
      return () => {
        active = false;
      };
    }

    setGeoLoading(true);
    resolveDestinationCoords(label, matchedLocation)
      .then((locationResult) => {
        if (active && locationResult) {
          setResolvedLocation(locationResult);
        }
      })
      .finally(() => {
        if (active) setGeoLoading(false);
      });

    return () => {
      active = false;
    };
  }, [destination, location, matchedLocation]);

  const center = resolvedLocation.coords;
  const mapZoom = resolvedLocation.zoom || matchedLocation.zoom || 12;
  const hasValidCenter =
    Array.isArray(center) &&
    center.length === 2 &&
    Number.isFinite(center[0]) &&
    Number.isFinite(center[1]) &&
    center[0] >= -90 &&
    center[0] <= 90 &&
    center[1] >= -180 &&
    center[1] <= 180;

  /* ===================================================== */
  /* SAFE LIMITED DATA */
  /* ===================================================== */

  const hotelMarkers = useMemo(
    () => hotels.slice(0, 5),
    [hotels]
  );

  const restaurantMarkers = useMemo(
    () => restaurants.slice(0, 5),
    [restaurants]
  );

  const pickupMarkers = useMemo(
    () => pickupPoints.filter(Boolean).slice(0, 4),
    [pickupPoints]
  );

  const attractionMarkers = useMemo(
    () => nearbyAttractions.filter(Boolean).slice(0, 5),
    [nearbyAttractions]
  );

  const hotelMarkerData = useMemo(
    () => hotelMarkers
      .map((hotel) => ({ item: hotel, coords: itemCoords(hotel) }))
      .filter((item) => item.coords),
    [hotelMarkers]
  );

  const restaurantMarkerData = useMemo(
    () => restaurantMarkers
      .map((restaurant) => ({ item: restaurant, coords: itemCoords(restaurant) }))
      .filter((item) => item.coords),
    [restaurantMarkers]
  );

  const attractionMarkerData = useMemo(
    () => attractionMarkers
      .map((attraction) => ({ item: attraction, coords: attractionCoords(attraction) }))
      .filter((item) => item.coords),
    [attractionMarkers]
  );

  const pickupMarkerData = useMemo(
    () => pickupMarkers.map((point, index) => ({
      item: point,
      coords: matchPickup(point, index, center),
    })),
    [center, pickupMarkers]
  );

  const markerPositions = useMemo(
    () => [
      center,
      ...hotelMarkerData.map((marker) => marker.coords),
      ...restaurantMarkerData.map((marker) => marker.coords),
      ...pickupMarkerData.map((marker) => marker.coords),
      ...attractionMarkerData.map((marker) => marker.coords),
    ],
    [attractionMarkerData, center, hotelMarkerData, pickupMarkerData, restaurantMarkerData]
  );

  /* ===================================================== */
  /* UI */
  /* ===================================================== */

  if (!hasValidCenter) {
    return (
      <section className="rounded-[26px] border border-orange-100 bg-orange-50 p-6 text-orange-800">
        <h2 className="text-xl font-semibold">Map unavailable</h2>
        <p className="mt-2 text-sm leading-relaxed">
          Destination coordinates could not be validated for this itinerary.
        </p>
      </section>
    );
  }

  return (

    <section className="overflow-hidden rounded-[26px] border border-slate-100 bg-white">

      {/* HEADER */}

      {showChrome && <div className="px-6 py-6 md:px-8">

        <h2 className="text-xl font-semibold text-slate-950">

          AI Travel Map

        </h2>

        <p className="mt-2 text-sm leading-relaxed text-slate-500">

          Destination, stay, dining, and attraction markers

        </p>

      </div>}

      {/* MAP WRAPPER */}

      <div className={showChrome ? "relative mx-3 mb-3 overflow-hidden rounded-[22px] md:mx-4 md:mb-4" : "relative overflow-hidden rounded-[26px]"}>

        {geoLoading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/75 text-sm font-semibold text-slate-600 backdrop-blur-sm">
            Refining map location...
          </div>
        )}

        <MapContainer
          center={center}
          zoom={mapZoom}
          scrollWheelZoom={false}
          className={`w-full ${heightClass} z-0`}
        >

          {/* MAP TILES */}

          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <FitBounds
            positions={markerPositions}
            fallbackCenter={center}
            fallbackZoom={mapZoom}
          />

          {/* MAIN DESTINATION */}

          <Marker position={center} icon={markerIcon("destination")}>

            <Popup>

              <div className="min-w-[160px]">

                <h3 className="font-bold text-slate-950">

                  {destination || "Destination"}

                </h3>

                <p className="text-sm text-slate-500 mt-1">

                  Main trip location

                </p>

              </div>

            </Popup>

          </Marker>

          {/* HOTELS */}

          {hotelMarkerData.map(({ item: hotel, coords }, index) => (

            <Marker
              key={`hotel-${index}`}
              position={coords}
              icon={markerIcon("hotel")}
            >

              <Popup>

                <div className="space-y-1 min-w-[180px]">

                  <h3 className="font-bold text-slate-950">

                    {hotel.name}

                  </h3>

                  {(hotel.price_range || hotel.price) && (
                    <p className="text-sm text-slate-500">

                      {hotel.price_range || hotel.price}

                    </p>
                  )}

                </div>

              </Popup>

            </Marker>

          ))}

          {/* RESTAURANTS */}

          {restaurantMarkerData.map(({ item: restaurant, coords }, index) => (

            <Marker
              key={`restaurant-${index}`}
              position={coords}
              icon={markerIcon("restaurant")}
            >

              <Popup>

                <div className="space-y-1 min-w-[180px]">

                  <h3 className="font-bold text-slate-950">

                    {restaurant.name}

                  </h3>

                  <p className="text-sm text-slate-600">

                    {restaurant.cuisine || "Multi Cuisine"}

                  </p>

                </div>

              </Popup>

            </Marker>

          ))}

          {pickupMarkerData.map(({ item: point, coords }, index) => (
            <Marker
              key={`pickup-${index}`}
              position={coords}
              icon={markerIcon("pickup")}
            >
              <Popup>
                <div className="min-w-[170px]">
                  <h3 className="font-bold text-slate-950">
                    {point}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Pickup point
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}

          {attractionMarkerData.map(({ item: attraction, coords }, index) => (
            <Marker
              key={`attraction-${index}`}
              position={coords}
              icon={markerIcon("attraction")}
            >
              <Popup>
                <div className="min-w-[170px]">
                  <h3 className="font-bold text-slate-950">
                    {typeof attraction === "string"
                      ? attraction
                      : attraction.name || "Nearby attraction"}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Nearby attraction
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}

        </MapContainer>

      </div>

      {showChrome && <div className="grid gap-4 px-6 pb-6 pt-2 text-sm leading-relaxed text-slate-600 md:grid-cols-3 md:px-8">
        <span>
          Destination: <strong className="text-slate-950">{destination || location || "Maharashtra"}</strong>
        </span>
        <span>
          Coordinates: <strong className="text-slate-950">{center[0].toFixed(4)}, {center[1].toFixed(4)}</strong>
        </span>
        <span>
          Source: <strong className="text-slate-950">OpenStreetMap</strong>
        </span>
      </div>}

    </section>

  );

}

export default memo(TravelMap);
