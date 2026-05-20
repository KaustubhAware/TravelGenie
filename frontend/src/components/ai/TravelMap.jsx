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
  hotels = [],
  restaurants = [],
}) {

  /* ===================================================== */
  /* DEFAULT LOCATION */
  /* ===================================================== */

  const center = useMemo(
    () => [19.9975, 73.7898],
    []
  );

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
          zoom={11}
          scrollWheelZoom={false}
          className="w-full h-[320px] md:h-[420px] z-0"
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

                    ⭐ {hotel.rating || "4.5"}

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

                    ⭐ {restaurant.rating || "4.4"}

                  </p>

                </div>

              </Popup>

            </Marker>

          ))}

        </MapContainer>

      </div>

    </section>

  );

}

export default memo(TravelMap);