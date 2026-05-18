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

  const hotelMarkers = useMemo(
    () => hotels.slice(0, 8),
    [hotels]
  );

  const restaurantMarkers = useMemo(
    () => restaurants.slice(0, 8),
    [restaurants]
  );

  return (

    <div className="bg-white border border-gray-200 rounded-[28px] overflow-hidden">

      <div className="p-6 border-b border-gray-100">

        <h2 className="text-3xl font-bold text-gray-900">

          AI Travel Map

        </h2>

        <p className="text-gray-500 mt-1">

          Smart location visualization

        </p>

      </div>

      <MapContainer
        center={center}
        zoom={11}
        scrollWheelZoom={true}
        className="h-[500px] w-full"
      >

        {/* MAP TILES */}

        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* DESTINATION */}

        <Marker position={center}>

          <Popup>

            <div>

              <h3 className="font-bold">

                {destination}

              </h3>

              <p>

                Main destination

              </p>

            </div>

          </Popup>

        </Marker>

        {/* HOTELS */}

        {hotelMarkers.map((hotel, index) => (

          <Marker
            key={index}
            position={[
  center[0] + 0.01 * index,
  center[1] + 0.01 * index,
]}
          >

            <Popup>

              <div className="space-y-2">

                <h3 className="font-bold">

                  {hotel.name}

                </h3>

                <p>

                  ⭐ {hotel.rating}

                </p>

                <p>

                  {hotel.price_range}

                </p>

              </div>

            </Popup>

          </Marker>

        ))}

        {/* RESTAURANTS */}

        {restaurantMarkers.map((restaurant, index) => (

          <Marker
            key={index}
            position={[
  center[0] + 0.01 * index,
  center[1] + 0.01 * index,
]}
          >

            <Popup>

              <div className="space-y-2">

                <h3 className="font-bold">

                  {restaurant.name}

                </h3>

                <p>

                  {restaurant.cuisine}

                </p>

                <p>

                  ⭐ {restaurant.rating}

                </p>

              </div>

            </Popup>

          </Marker>

        ))}

      </MapContainer>

    </div>

  );

}

export default memo(TravelMap);
