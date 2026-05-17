export default function PreferenceChips({
  recommendations = [],
}) {

  if (!recommendations?.length) {
    return null;
  }

  return (

    <div>

      <div className="flex items-center justify-between mb-5">

        <div>

          <h3 className="text-2xl font-bold text-gray-900">

            Recommended Places

          </h3>

          <p className="text-gray-500 mt-1">

            AI curated destination highlights

          </p>

        </div>

      </div>

      <div className="flex flex-wrap gap-3">

        {recommendations.map((place, index) => (

          <div
            key={index}
            className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 text-blue-700 text-sm font-medium"
          >

            {place}

          </div>

        ))}

      </div>

    </div>

  );

}