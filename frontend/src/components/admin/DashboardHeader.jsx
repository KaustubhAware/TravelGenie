import { FaSearch } from "react-icons/fa";

export default function DashboardHeader({
  search,
  setSearch,
}) {

  return (

    <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-8 py-5 flex items-center justify-between">

      {/* LEFT */}

      <div>

        <h1 className="text-3xl font-bold text-gray-900">

          Admin Dashboard

        </h1>

        <p className="text-gray-500 mt-1">

          Monitor bookings, revenue and travel agency performance

        </p>

      </div>

      {/* RIGHT */}

      <div className="flex items-center gap-4">

        {/* SEARCH */}

        <div className="relative">

          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

          <input
            type="text"
            placeholder="Search bookings..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="pl-11 pr-4 py-3 rounded-2xl border border-gray-200 bg-white outline-none w-[280px] focus:ring-2 focus:ring-blue-500"
          />

        </div>

        {/* AVATAR */}

        <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">

          A

        </div>

      </div>

    </div>

  );
}