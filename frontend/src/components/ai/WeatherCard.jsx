import {
  FaCloudSun,
} from "react-icons/fa";

export default function WeatherCard({
  weather = {},
}) {

  if (!Object.keys(weather || {}).length) {
    return null;
  }

  return (

    <div className="bg-white border border-gray-200 rounded-[28px] p-6">

      <div className="flex items-center justify-between">

        <div>

          <h2 className="text-2xl font-bold text-gray-900">

            Weather Forecast

          </h2>

          <p className="text-gray-500 mt-1">

            Current destination weather

          </p>

        </div>

        <FaCloudSun className="text-4xl text-orange-500" />

      </div>

      <div className="mt-6">

        <h3 className="text-5xl font-bold text-gray-900">

          {weather.temperature || weather.summary || weather.condition || "Weather details"}

        </h3>

        <p className="text-gray-600 mt-3">

          {weather.condition || weather.summary || "Review local forecast before departure."}

        </p>

      </div>

      {weather.best_season && (
        <div className="mt-6 bg-orange-50 rounded-2xl p-5">

          <p className="text-sm text-gray-600">

            Best Season

          </p>

          <h4 className="font-bold text-2xl text-gray-900 mt-2">

            {weather.best_season}

          </h4>

        </div>
      )}

    </div>

  );

}
