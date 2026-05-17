import { FaArrowRight, FaUsers } from "react-icons/fa";

const preferencesList = [
  "Luxury",
  "Adventure",
  "Nightlife",
  "Food",
  "Beaches",
  "Mountains",
  "Family",
  "Solo",
  "Romantic",
  "Shopping",
];

export default function AITripForm({
  form,
  setForm,
  handleSubmit,
  loading,
}) {

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  };

  const togglePreference = (item) => {

    const exists = form.preferences.includes(item);

    if (exists) {

      setForm({
        ...form,
        preferences: form.preferences.filter(
          (p) => p !== item
        ),
      });

    } else {

      setForm({
        ...form,
        preferences: [
          ...form.preferences,
          item,
        ],
      });

    }

  };

  return (

    <div className="bg-white rounded-[26px] border border-gray-200 shadow-sm h-full overflow-hidden">

      <div className="p-6">

        <div className="mb-8">

          <h2 className="text-2xl font-bold text-gray-900">

            AI Travel Planner

          </h2>

          <p className="text-gray-500 mt-2">

            Generate intelligent AI-powered travel itineraries

          </p>

        </div>

        <div className="space-y-5">

          {/* DESTINATION */}

          <div>

            <label className="block text-sm font-semibold text-gray-700 mb-2">

              Destination

            </label>

            <input
              type="text"
              name="destination"
              value={form.destination}
              onChange={handleChange}
              placeholder="Where do you want to go?"
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />

          </div>

          {/* BUDGET */}

          <div>

            <label className="block text-sm font-semibold text-gray-700 mb-2">

              Budget

            </label>

            <input
              type="number"
              name="budget"
              value={form.budget}
              onChange={handleChange}
              placeholder="Enter your budget"
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />

          </div>

          {/* DAYS */}

          <div>

            <label className="block text-sm font-semibold text-gray-700 mb-2">

              Number of Days

            </label>

            <input
              type="number"
              name="days"
              value={form.days}
              onChange={handleChange}
              placeholder="How many days?"
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />

          </div>

          {/* TRAVELERS */}

          <div>

            <label className="block text-sm font-semibold text-gray-700 mb-2">

              Travelers

            </label>

            <div className="relative">

              <FaUsers className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                type="number"
                name="travelers"
                value={form.travelers}
                onChange={handleChange}
                placeholder="Number of travelers"
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 pl-12 pr-5 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />

            </div>

          </div>

          {/* TRIP TYPE */}

          <div>

            <label className="block text-sm font-semibold text-gray-700 mb-2">

              Trip Type

            </label>

            <select
              name="trip_type"
              value={form.trip_type}
              onChange={handleChange}
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            >

              <option value="">
                Select trip type
              </option>

              <option value="Couple">
                Couple
              </option>

              <option value="Family">
                Family
              </option>

              <option value="Friends">
                Friends
              </option>

              <option value="Solo">
                Solo
              </option>

            </select>

          </div>

          {/* PREFERENCES */}

          <div>

            <label className="block text-sm font-semibold text-gray-700 mb-4">

              Travel Preferences

            </label>

            <div className="flex flex-wrap gap-3">

              {preferencesList.map((item) => {

                const active =
                  form.preferences.includes(item);

                return (

                  <button
                    key={item}
                    type="button"
                    onClick={() =>
                      togglePreference(item)
                    }
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      active
                        ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-blue-50"
                    }`}
                  >

                    {item}

                  </button>

                );

              })}

            </div>

          </div>

          {/* BUTTON */}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full mt-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
          >

            {loading
              ? "Generating..."
              : "Generate AI Trip"}

            {!loading && <FaArrowRight />}

          </button>

        </div>

      </div>

    </div>

  );

}