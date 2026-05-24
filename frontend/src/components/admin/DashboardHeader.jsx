import {
  FaSearch,
  FaBell,
  FaBars,
  FaChevronDown,
} from "react-icons/fa";

/* ===================================================== */
/* COMPONENT */
/* ===================================================== */

export default function DashboardHeader({
  search,
  setSearch,
  sidebarOpen,
  setSidebarOpen,
}) {

  return (

    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">

      <div className="h-[78px] px-4 md:px-6 xl:px-8 flex items-center justify-between gap-4">

        {/* ===================================================== */}
        {/* LEFT */}
        {/* ===================================================== */}

        <div className="flex items-center gap-4 min-w-0">

          {/* MOBILE SIDEBAR BUTTON */}

          <button
            onClick={() =>
              setSidebarOpen(
                !sidebarOpen
              )
            }
            className="lg:hidden w-11 h-11 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-700 hover:bg-slate-50 transition"
          >

            <FaBars />

          </button>

          {/* TITLE */}

          <div className="min-w-0">

            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">

              Admin Panel

            </p>

            <h1 className="text-2xl font-bold text-slate-900 truncate">

              Dashboard

            </h1>

          </div>

        </div>

        {/* ===================================================== */}
        {/* RIGHT */}
        {/* ===================================================== */}

        <div className="flex items-center gap-3">

          {/* SEARCH */}

          <div className="hidden md:block relative">

            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />

            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="w-[280px] rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
            />

          </div>

          {/* NOTIFICATIONS */}

          <button className="relative w-11 h-11 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-50 transition">

            <FaBell className="text-sm" />

            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-red-500" />

          </button>

          {/* ADMIN */}

          <button className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 hover:bg-slate-50 transition">

            {/* AVATAR */}

            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white font-semibold">

              A

            </div>

            {/* INFO */}

            <div className="hidden md:block text-left">

              <h3 className="text-sm font-semibold text-slate-900">

                Admin

              </h3>

              <p className="text-xs text-slate-500">

                Administrator

              </p>

            </div>

            <FaChevronDown className="hidden md:block text-slate-400 text-xs" />

          </button>

        </div>

      </div>

    </header>

  );

}