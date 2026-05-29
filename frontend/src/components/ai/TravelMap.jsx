import {
  memo,
  useMemo,
} from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
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

/* ===================================================== */
/* FIX DEFAULT MARKER */
/* ===================================================== */

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

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
}) {

  /* ===================================================== */
  /* DEFAULT LOCATION */
  /* ===================================================== */

  const matchedLocation = useMemo(
    () => matchCoordinates(`${destination || ""} ${location || ""}`),
    [destination, location]
  );

  const center = matchedLocation.coords;

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

  /* ===================================================== */
  /* UI */
  /* ===================================================== */

  return (

    <section className="bg-white border border-gray-200 rounded-[28px] overflow-hidden shadow-sm">

      {/* HEADER */}

      <div className="px-6 py-5 border-b border-gray-100">

        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">

          AI Travel Map

        </h2>

        <p className="text-gray-500 mt-1 text-sm md:text-base">

          Smart location visualization for your itinerary

        </p>

      </div>

      {/* MAP WRAPPER */}

      <div className="relative">

        <MapContainer
          center={center}
          zoom={matchedLocation.zoom}
          scrollWheelZoom={false}
          className={`w-full ${heightClass} z-0`}
        >

          {/* MAP TILES */}

          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* MAIN DESTINATION */}

          <Marker position={center}>

            <Popup>

              <div className="min-w-[160px]">

                <h3 className="font-bold text-gray-900">

                  {destination || "Destination"}

                </h3>

                <p className="text-sm text-gray-500 mt-1">

                  Main trip location

                </p>

              </div>

            </Popup>

          </Marker>

          {/* HOTELS */}

          {hotelMarkers.map((hotel, index) => (

            <Marker
              key={`hotel-${index}`}
              position={[
                center[0] + 0.015 * (index + 1),
                center[1] + 0.008 * (index + 1),
              ]}
            >

              <Popup>

                <div className="space-y-1 min-w-[180px]">

                  <h3 className="font-bold text-gray-900">

                    {hotel.name}

                  </h3>

                  <p className="text-sm text-gray-600">

                    Rating: {hotel.rating || "4.5"}

                  </p>

                  <p className="text-sm text-gray-500">

                    {hotel.price_range || "Moderate"}

                  </p>

                </div>

              </Popup>

            </Marker>

          ))}

          {/* RESTAURANTS */}

          {restaurantMarkers.map((restaurant, index) => (

            <Marker
              key={`restaurant-${index}`}
              position={[
                center[0] - 0.012 * (index + 1),
                center[1] - 0.009 * (index + 1),
              ]}
            >

              <Popup>

                <div className="space-y-1 min-w-[180px]">

                  <h3 className="font-bold text-gray-900">

                    {restaurant.name}

                  </h3>

                  <p className="text-sm text-gray-600">

                    {restaurant.cuisine || "Multi Cuisine"}

                  </p>

                  <p className="text-sm text-gray-500">

                    Rating: {restaurant.rating || "4.4"}

                  </p>

                </div>

              </Popup>

            </Marker>

          ))}

          {pickupMarkers.map((point, index) => (
            <Marker
              key={`pickup-${index}`}
              position={matchPickup(point, index, center)}
            >
              <Popup>
                <div className="min-w-[170px]">
                  <h3 className="font-bold text-gray-900">
                    {point}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Pickup point
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}

          {attractionMarkers.map((attraction, index) => (
            <Marker
              key={`attraction-${index}`}
              position={[
                center[0] + 0.01 * (index + 1),
                center[1] - 0.014 * (index + 1),
              ]}
            >
              <Popup>
                <div className="min-w-[170px]">
                  <h3 className="font-bold text-gray-900">
                    {typeof attraction === "string"
                      ? attraction
                      : attraction.name || "Nearby attraction"}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Nearby attraction
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}

        </MapContainer>

      </div>

      <div className="grid gap-3 border-t border-gray-100 px-6 py-4 text-sm text-gray-600 md:grid-cols-3">
        <span>
          Destination: <strong className="text-gray-900">{destination || location || "Maharashtra"}</strong>
        </span>
        <span>
          Coordinates: <strong className="text-gray-900">{center[0].toFixed(4)}, {center[1].toFixed(4)}</strong>
        </span>
        <span>
          Source: <strong className="text-gray-900">OpenStreetMap</strong>
        </span>
      </div>

    </section>

  );

}

export default memo(TravelMap);
