import {
  FaPlaneArrival,
  FaHotel,
  FaUtensils,
  FaMapMarkedAlt,
} from "react-icons/fa";

export default function DayPlanCard({
  day = {},
  index,
}) {

  const getIcon = (text = "") => {

    text = text.toLowerCase();

    if (text.includes("arrival")) {
      return <FaPlaneArrival />;
    }

    if (text.includes("hotel")) {
      return <FaHotel />;
    }

    if (
      text.includes("food") ||
      text.includes("restaurant") ||
      text.includes("lunch") ||
      text.includes("dinner")
    ) {
      return <FaUtensils />;
    }

    return <FaMapMarkedAlt />;

  };

  return (

    <div className="relative border border-gray-200 rounded-[28px] p-6 bg-white hover:border-orange-200 hover:shadow-lg transition-all duration-300 overflow-hidden">

      <div className="flex items-center justify-between mb-6">

        <div>

          <p className="text-sm text-orange-500 font-semibold mb-1">

            DAY {day?.day || index + 1}

          </p>

          <h3 className="text-2xl font-bold text-gray-900">

            {day?.title || `Day ${index + 1}`}

          </h3>

        </div>

        <div className="w-14 h-14 rounded-2xl bg-orange-500 text-white flex items-center justify-center font-bold text-lg shadow-lg">

          {day?.day || index + 1}

        </div>

      </div>

      <div className="space-y-4">

        {(Array.isArray(day?.activities) ? day.activities : []).map((activity, i) => {
          const label =
            typeof activity === "string"
              ? activity
              : activity.title ||
                activity.activity ||
                activity.description ||
                activity.name ||
                "Planned activity";

          const meta = [
            activity?.time || activity?.timing,
            activity?.transport,
            activity?.food,
            activity?.stay,
          ].filter(Boolean);

          return (

            <div
              key={i}
              className="flex items-start gap-4"
            >

              <div className="min-w-[44px] h-11 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">

                {getIcon(label)}

              </div>

              <div className="flex-1">

                <p className="text-gray-700 leading-relaxed">

                  {label}

                </p>

                {meta.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {meta.map((item) => (
                      <span
                        key={item}
                        className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                )}

              </div>

            </div>

          );
        })}

        {!Array.isArray(day?.activities) && day?.description && (
          <p className="text-gray-700 leading-relaxed">
            {day.description}
          </p>
        )}

      </div>

    </div>

  );

}
