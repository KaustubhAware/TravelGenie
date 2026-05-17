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

    <div className="relative border border-gray-200 rounded-[28px] p-6 bg-white hover:border-blue-200 hover:shadow-lg transition-all duration-300 overflow-hidden">

      <div className="flex items-center justify-between mb-6">

        <div>

          <p className="text-sm text-blue-500 font-semibold mb-1">

            DAY {day?.day || index + 1}

          </p>

          <h3 className="text-2xl font-bold text-gray-900">

            {day?.title || `Day ${index + 1}`}

          </h3>

        </div>

        <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white flex items-center justify-center font-bold text-lg shadow-lg">

          {day?.day || index + 1}

        </div>

      </div>

      <div className="space-y-4">

        {Array.isArray(day?.activities) &&
          day.activities.map((activity, i) => (

            <div
              key={i}
              className="flex items-start gap-4"
            >

              <div className="min-w-[44px] h-11 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">

                {getIcon(activity)}

              </div>

              <div className="flex-1">

                <p className="text-gray-700 leading-relaxed">

                  {activity}

                </p>

              </div>

            </div>

          ))}

      </div>

    </div>

  );

}