import {
  FaSuitcase,
} from "react-icons/fa";

export default function TravelTipsCard({
  tips = [],
}) {

  if (!tips.length) {

    return null;

  }

  return (

    <div className="bg-white border border-gray-200 rounded-[28px] p-6">

      <div className="mb-6">

        <h3 className="text-2xl font-bold text-gray-900">

          AI Travel Tips

        </h3>

        <p className="text-gray-500 mt-1">

          Smart personalized recommendations

        </p>

      </div>

      <div className="space-y-4">

        {tips.map((tip, index) => (

          <div
            key={index}
            className="flex items-start gap-4"
          >

            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center">

              <FaSuitcase />

            </div>

            <div>

              <p className="text-gray-700 leading-relaxed">

                {tip}

              </p>

            </div>

          </div>

        ))}

      </div>

    </div>

  );

}