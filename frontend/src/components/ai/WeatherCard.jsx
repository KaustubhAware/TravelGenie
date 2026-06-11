import {
  CloudRain,
  SunMedium,
  ThermometerSun,
} from "lucide-react";

const pick = (...values) => values.find((value) => value !== undefined && value !== null && value !== "");

export default function WeatherCard({ weather = {}, bestSeason = "", packing = [], compact = false }) {
  if (!Object.keys(weather || {}).length && !bestSeason && !packing.length) {
    return null;
  }

  const packingSuggestions = Array.isArray(weather.packing_suggestions)
    ? weather.packing_suggestions
    : Array.isArray(packing)
      ? packing
      : [];

  const items = [
    {
      label: "Temperature",
      value: pick(weather.temperature, weather.temp, weather.summary, "Check live forecast"),
      icon: ThermometerSun,
    },
    {
      label: "Rain Chances",
      value: pick(weather.rain_chances, weather.rain_probability, weather.rain, weather.precipitation, "Check before departure"),
      icon: CloudRain,
    },
    {
      label: "Season Advice",
      value: pick(weather.season_advice, weather.advice, weather.condition, bestSeason, "Plan with local conditions"),
      icon: SunMedium,
    },
    {
      label: "Best Travel Time",
      value: pick(weather.best_travel_time, weather.best_time, weather.best_season, bestSeason, "Early morning departures"),
      icon: SunMedium,
    },
  ];

  return (
    <section className={compact ? "" : "rounded-3xl border border-slate-100 bg-white p-6 shadow-sm md:p-8"}>
      {!compact && (
        <div>
          <p className="text-sm font-semibold text-orange-600">
            Weather Overview
          </p>
          <h2 className="mt-2 text-2xl font-bold text-slate-950">
            Climate and packing intelligence
          </h2>
        </div>
      )}

      <div className={`${compact ? "" : "mt-8"} grid gap-5 md:grid-cols-2 xl:grid-cols-4`}>
        {items.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-3xl bg-slate-50/80 p-5 transition hover:bg-orange-50">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
              <Icon size={21} />
            </div>
            <p className="mt-4 text-sm font-semibold text-slate-500">
              {label}
            </p>
            <p className="mt-2 text-sm font-semibold leading-relaxed text-slate-800">
              {value}
            </p>
          </div>
        ))}
      </div>

      {packingSuggestions.length > 0 && (
        <div className="mt-6 rounded-3xl bg-orange-50 p-5">
          <p className="mb-4 text-lg font-semibold text-slate-950">
            Packing Suggestions
          </p>
          <div className="flex flex-wrap gap-2.5">
            {packingSuggestions.slice(0, 8).map((item) => (
              <span key={item} className="rounded-full bg-white px-3.5 py-1.5 text-sm font-semibold text-slate-700 shadow-sm">
                {item}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
